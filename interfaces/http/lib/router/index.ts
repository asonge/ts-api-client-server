import * as t from 'io-ts';
import * as express from 'express';
// import Axios, * as 'axios';

export type Verb = 'get' | 'put' | 'post' | 'delete';

// export type PT = t.AnyDictionaryType;
// export type QT = t.AnyDictionaryType;
// export type BT = t.AnyDictionaryType | t.AnyArrayType | t.UndefinedType;
// export type RT = t.AnyDictionaryType | t.AnyArrayType | t.UndefinedType;
// type BodyType = t.Type<any, any, any>
export type PT = t.Any // t.Type<{}, {}, {}>;
export type QT = t.Any // t.Type<{}, {}, {}>;
export type BT = t.Any // BodyType;
export type RT = t.Any // BodyType;



export interface Route<P extends PT, Q extends QT, B extends BT, R extends RT> {
  readonly verb: Verb
  readonly path: string
  readonly params: P
  readonly query: Q
  readonly body: B
  readonly resp: R
}

interface RequestDetails<P extends PT, Q extends QT, B extends BT> {
  params: P
  query: Q
  body: B
}
type PartialRequestDetails<P extends PT, Q extends QT, B extends BT> = Partial<RequestDetails<P,Q,B>>;

interface RouterOptions {
  prefix?: string
}

function undefOr<T>(value: T | undefined, other: T): T {
  if(typeof value === 'undefined') {
    return other;
  } else {
    return value;
  }
}

const defaultDetails = <RequestDetails<t.InterfaceType<{}>,t.InterfaceType<{}>,t.UndefinedType>>{
  params: t.type({}),
  query: t.type({}),
  body: t.undefined
}

function mergeDetails<P extends PT,Q extends QT,B extends BT>
(details: PartialRequestDetails<P,Q,B>): RequestDetails<P,Q,B> {
  return {...defaultDetails, ...details} as RequestDetails<P,Q,B>;
}

export default class Router {
  public readonly prefix?: string;

  static route<P extends PT, Q extends QT, B extends BT, R extends RT>(verb: Verb, path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    const {params, query, body} = mergeDetails(details);
    return { verb, path, params, query, body, resp };
  }

  static get<P extends PT, Q extends QT, B extends BT, R extends RT>
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('get', path, resp, details);
  }

  static post<P extends PT, Q extends QT, B extends BT, R extends RT>
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('post', path, resp, details);
  }

  static put<P extends PT, Q extends QT, B extends BT, R extends RT>
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('put', path, resp, details);
  }

  static delete<P extends PT, Q extends QT, B extends BT, R extends RT>
  (path: string, resp: R, details: PartialRequestDetails<P, Q, B>): Route<P, Q, B, R> {
    return this.route('delete', path, resp, details);
  }
}



