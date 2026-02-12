import { createUser, deleteUser, getUserById, getUsers, updateUser } from '#controllers';
import { validateBody } from '#middleware';
import { userInputSchema, userUpdateInputSchema } from '#schemas';
import { Router } from 'express';

const userRouter = Router();

userRouter.route('/').get(getUsers).post(validateBody(userInputSchema), createUser);
userRouter.route('/:id').get(getUserById).put(validateBody(userUpdateInputSchema), updateUser).delete(deleteUser);

export default userRouter;
