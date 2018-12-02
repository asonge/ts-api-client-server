import * as t from 'io-ts';

export type Verb = 'get' | 'put' | 'post' | 'delete';

export type PT = t.Any
export type QT = t.Any
export type BT = t.Any
export type RT = t.Any

export class Route<P extends PT, Q extends QT, B extends BT, R extends RT> {
  constructor(public verb: Verb, public path: string, public params: P, public query: Q, public body: B, public resp: R){}
}

interface RequestDetails<P extends PT, Q extends QT, B extends BT> {
  params: P
  query: Q
  body: B
}
type PartialRequestDetails<P extends PT, Q extends QT, B extends BT> = Partial<RequestDetails<P,Q,B>>;

const defaultProps = t.exact(t.type({}));
const defaultDetails = {
  params: defaultProps,
  query: defaultProps,
  body: t.undefined
}

export type AnyRoute = Route<any,any,any,any>;
export type Routes = { [index: string]: AnyRoute }

export interface IRouter<T> {
  readonly prefix: string,
  routes: T
}

export default {

  createRouter<T>(prefix: string, routes: T): IRouter<T> {
    return {
      prefix,
      routes
    }
  },

  route<P extends PT, Q extends QT, B extends BT, R extends RT>(verb: Verb, path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    const {params, query, body} = Object.assign({}, defaultDetails, details);
    return new Route(verb, path, params, query, body, resp);
  },

  
  get<
  R extends RT,
  P extends PT = typeof defaultDetails.params,
  Q extends QT = typeof defaultDetails.query,
  B extends BT = typeof defaultDetails.body
  >
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('get', path, resp, details);
  },

  post<
  R extends RT,
  P extends PT = typeof defaultDetails.params,
  Q extends QT = typeof defaultDetails.query,
  B extends BT = typeof defaultDetails.body
  >
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('post', path, resp, details);
  },

  put<
  R extends RT,
  P extends PT = typeof defaultDetails.params,
  Q extends QT = typeof defaultDetails.query,
  B extends BT = typeof defaultDetails.body,
  >
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('put', path, resp, details);
  },

  delete<
  R extends RT,
  P extends PT = typeof defaultDetails.params,
  Q extends QT = typeof defaultDetails.query,
  B extends BT = typeof defaultDetails.body,
  >
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('delete', path, resp, details);
  }
}



