import * as t from 'io-ts';
import Router from '../lib/router';

export const User = t.type({
  name: t.string,
  phone: t.string
})
// export const ExistingUser = t.type({
//   id: t.number,
//   name: t.string,
//   phone: t.string
// })
export const ExistingUser = t.exact(t.intersection([t.type({id: t.number}), User]))
export const PartialUser = t.exact(t.partial(User.props));

const p = {
  idParam: t.type({id: t.number})
};

export const UserRouter = Router.createRouter('/users', {
  getUser: Router.get(':id', ExistingUser, {params: p.idParam}),
  createUser: Router.post('', ExistingUser, {body: User}),
  updateUser: Router.put(':id', ExistingUser, {body: PartialUser, params: p.idParam}),
  deleteUser: Router.delete(':id', t.undefined, {params: p.idParam})
});