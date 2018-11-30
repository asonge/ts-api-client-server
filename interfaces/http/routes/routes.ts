import * as t from 'io-ts';
import Router from '../lib/router';

export const User = t.type({
  name: t.string,
  phone: t.string
})
export const ExistingUser = t.intersection([User, t.type({id: t.number})])
export const PartialUser = t.partial(User.props);

const p = {
  idParam: t.type({id: t.number})
};

export class UserRouter extends Router {
  static prefix = 'users'

  static paramTypes = p

  static getUser = Router.get(':id', ExistingUser, {params: p.idParam})
  static createUser = Router.post('', ExistingUser, {body: User})
  static updateUser = Router.put(':id', ExistingUser, {body: PartialUser})
  static deleteUser = Router.delete(':id', t.undefined, {params: p.idParam})
}