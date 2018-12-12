# Typescript + io-ts + express + axios playground

I want serverside and clientside types and I want them now.

## Routes as types

The motivation behind this experiment is to express a route as a type. A route is a type that shows the relationship between an HTTP request (namely, the url params, query params, and body of an HTTP request) and a return type. The basic router is simply an object whose properties are types.

The basic router can then be reified into an API client or an API server. It does this by creating a new router which takes the properties of the basic router and implements a transform that corresponds to the routing information. An API client's "route" implementation takes any arguments needed and transforms them into a request object that the client adapter can consume. The route implementation's return type is type-checked so that the adapter can take the return value and send it off to the API server. An API server's "route" implementation is invoked by an adapter which checks the types, and the actual route function transform the request information and must return the correct body type. A router is reified when every route in the base router is present in the client or server implementation.
