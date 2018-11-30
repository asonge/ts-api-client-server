import * as t from 'io-ts';
import {UserRouter, ExistingUser, User} from './routes';
import {ThrowReporter} from 'io-ts/lib/ThrowReporter';
import {AsyncRouter} from '../lib/router/express';

const router = AsyncRouter();
export default router;
const prefix = UserRouter.prefix;

const existing_user = User.decode({
  id: 3,
  name: "Joe",
  phone: "55"
});

async function decodePromise<T extends t.Any>(type: T, input: t.InputOf<T>): Promise<t.TypeOf<T>> {
  const result = type.decode(input);
  if(result.isRight()) {
    return result;
  } else {
    const err = ThrowReporter.report(result);
    throw err;
  }
}

router.use(UserRouter.getUser, async(req) => {
  return {
    id: req.params.id,
    name: 'Test User',
    phone: '5'
  }
});
router.use(UserRouter.createUser, async(req) => {
  return decodePromise(ExistingUser, {
    id: Math.random(),
    name: req.body.name,
    phone: req.body.phone
  });
});
router.use(UserRouter.updateUser, async(req) => {
  return decodePromise(ExistingUser, {...existing_user, ...req.body});
})
