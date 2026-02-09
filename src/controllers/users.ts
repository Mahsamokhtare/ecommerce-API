import { type RequestHandler } from 'express';
import type { userInputSchema, userSchema, userUpdateInputSchema } from '#schemas';
import type { z } from 'zod/v4';
import { User } from '#models';

type UserInputDTO = z.infer<typeof userInputSchema>;

type UserUpdateDTo = z.infer<typeof userUpdateInputSchema>;

type UserDTO = z.infer<typeof userSchema>;

type IdParams = { id: string };

const getUsers: RequestHandler<{}, UserDTO[]> = async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
};
const createUser: RequestHandler<{}, UserDTO, UserInputDTO> = async (req, res) => {
  const { body } = req;
  const found = await User.findOne({ email: body.email });
  if (found) throw new Error('User already exists', { cause: { status: 409 } });
  const user = await User.create(body satisfies UserInputDTO);
  console.log('hehe');
  res.status(201).json;
};

const updateUser: RequestHandler<IdParams, UserDTO, UserUpdateDTo> = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
  const { name } = body;

  const user = await User.findById(id);

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  user.name = name;
  await user.save();
  res.json(user);
};

const getUserById: RequestHandler<IdParams, UserDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const user = await User.findById(id).lean();

  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json(user);
};

const deleteUser: RequestHandler<IdParams> = async (req, res) => {
  const {
    params: { id }
  } = req;

  const user = User.findByIdAndDelete(id);
  if (!user) throw new Error('User not found', { cause: { status: 404 } });

  res.json({ message: 'User deleted' });
};

export { getUserById, createUser, updateUser, getUsers, deleteUser };
