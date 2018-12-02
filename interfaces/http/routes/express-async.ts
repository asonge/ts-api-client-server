import * as t from 'io-ts';
import {UserRouter, ExistingUser} from './routes';
import {ThrowReporter} from 'io-ts/lib/ThrowReporter';
import {reifyRouter, TransformedRoutes} from '../lib/router/express-async';

async function decodePromise<T extends t.Any>(type: T, input: t.InputOf<T>): Promise<t.TypeOf<T>> {
  const result = type.decode(input);
  if(result.isRight()) {
    return result;
  } else {
    const err = ThrowReporter.report(result);
    throw err;
  }
}

reifyRouter(UserRouter, <TransformedRoutes<typeof UserRouter.routes>>{
  async getUser(req) {
    return {
      id: req.params.id,
      name: 'Test User',
      phone: '5'
    }
  },
  async createUser(req) {
    return {
      id: Math.random(),
      name: 'Test User',
      phone: '5'
    }
  },
  async updateUser(req) {
    return decodePromise(ExistingUser, {
      id: req.params.id,
      name: req.body.name,
      phone: req.body.phone
    });
  },
  async deleteUser(req) {
    return undefined;
  }
});