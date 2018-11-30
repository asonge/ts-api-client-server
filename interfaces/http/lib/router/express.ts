import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Handler, Request, Response, Router as ExpressRouter, RouterOptions, NextFunction, RequestHandler } from 'express';
import { Route, PT, QT, RT, BT} from "./index"

interface TypedRequest<P extends PT, Q extends QT, B extends BT> extends Request {
  params: t.OutputOf<P>
  query: t.OutputOf<Q>
  body: t.OutputOf<B>
}

interface TypedResponse<R extends RT> extends Response {
  json(body?: t.TypeOf<R>): this
}
type TypedAsyncHandler<P extends PT, Q extends QT, B extends BT, R extends RT> = (req: TypedRequest<P, Q, B>) => Promise<t.TypeOf<R>>
type TypedHandler<P extends PT, Q extends QT, B extends BT, R extends RT> = (req: TypedRequest<P, Q, B>, res: TypedResponse<R>, next: NextFunction) => any;

interface IAsyncRouter {
  expressRouter(): RequestHandler
  use<P extends PT, Q extends QT, B extends BT, R extends RT>
    (route: Route<P, Q, B, R>, handler: TypedAsyncHandler<P, Q, B, R>):
    this
}
interface IRouter {
  expressRouter(): RequestHandler
  use<P extends PT, Q extends QT, B extends BT, R extends RT>
    (route: Route<P, Q, B, R>, handler: TypedHandler<P, Q, B, R>):
    this
}

export function AsyncRouter(options?: RouterOptions): IAsyncRouter {
  const router = ExpressRouter(options);
  return {
    expressRouter() { return router; },
    use(route, handler) {
      router[route.verb](route.path, middlewareFactory(route), asyncHandler(handler));
      return this;
    }
  }
}

function asyncHandler<P extends PT, Q extends QT, B extends BT, R extends RT>(handler: TypedAsyncHandler<P, Q, B, R>): Handler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await handler(req);
      if (typeof response === undefined) {
        res.status(204);
      } else {
        res.json(response);
      }
    } catch (err) {
      next(err);
    }
  };
}

export function Router(options?: RouterOptions): IRouter {
  const router = ExpressRouter(options);
  return {
    expressRouter() { return router; },
    use(route, handler) {
      router[route.verb](route.path, middlewareFactory(route), handler);
      return this;
    }
  }
}

function middlewareFactory(route: Route<any, any, any, any>): Handler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = t.type({
      params: route.params,
      query: route.query,
      body: route.body
    }, 'request').decode(req);
    if (result.isRight()) {
      next();
    } else {
      const report = PathReporter.report(result);
      next(new InputError(report))
    }
  }
};

export class InputError extends Error {
  readonly code = 406;
  readonly report: any;
  constructor(report: any) {
    super('Precondition failed');
    this.report = report;
  }
}