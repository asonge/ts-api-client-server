// interface ClientRequest<P extends t.Type<{}>, Q extends t.Type<{}>, B extends t.Any> {
//   params: t.OutputOf<P>
//   query: t.OutputOf<Q>
//   body: t.OutputOf<B>
// }

// interface ClientRequest {
//   verb: Verb
//   path: string
//   query: {},
//   body: {} | undefined,
//   resp: t.Any
// }
// function makeRequest({resp}: Route, req: ClientRequest): Promise<any> {
//   return Axios.request({
//     method: req.verb,
//     url: req.path,
//     params: req.query,
//     data: req.body
//   }).then(response => {
//     const result = resp.decode(response.data);
//     const report = PathReporter.report(result);
//     if(result.isRight()) {
//       return result;
//     }
//   }) as Promise<any>;
// }

