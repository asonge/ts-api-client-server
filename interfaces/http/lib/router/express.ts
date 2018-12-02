import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Handler, Request, Response, Router as ExpressRouter, RouterOptions, NextFunction, RequestHandler } from 'express';
import * as TRouter from "./index"
import { AnyRoute, Route, PT, QT, RT, BT } from "./index"

interface TypedRequest<P extends PT, Q extends QT, B extends BT> extends Request {
  params: P
  query: Q
  body: B
}

interface TypedResponse<R> extends Response {
  json(body?: R): this
}

type TransformRequestHandler<RO> = RO extends Route<infer P, infer Q, infer B, infer R>
  ? (req: TypedRequest<t.TypeOf<P>, t.TypeOf<Q>, t.TypeOf<B>>, res: TypedResponse<t.TypeOf<R>>, next: NextFunction) => void
  : never;
export type TransformedRoutes<T> = {
  [K in keyof T]: TransformRequestHandler<T[K]>
}

type AnyRoutes = {[index: string]: AnyRoute};
type AnyRequestHandlers = {[index: string]: Handler};

export function reifyRouter<T>(router: TRouter.IRouter<T>, handlers: TransformedRoutes<T>, express_options: RouterOptions = {}): ExpressRouter {
  const routes = router.routes as unknown;
  const erouter = ExpressRouter(express_options);
  installRoutes(erouter, routes as AnyRoutes, handlers as AnyRequestHandlers);
  return erouter;
}

function installRoutes(
  erouter: ExpressRouter,
  routes: AnyRoutes,
  handlers: AnyRequestHandlers)
{
  Object.keys(handlers).forEach(name => {
    const route = routes[name];
    const handler = handlers[name];
    erouter.use(route.path, middlewareFactory(route), handler);
  })
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