import { Category } from '#models';
import { categoryInputSchema, type categorySchema } from '#schemas';
import type { RequestHandler } from 'express';
import type { z } from 'zod/v4';

type categoryInputDTO = z.infer<typeof categoryInputSchema>;
type categoryDTO = z.infer<typeof categorySchema>;
type IdParams = { id: string };

const getAllCategries: RequestHandler<categoryDTO> = async (req, res, next) => {
  const categories = await Category.find().lean();
  res.json(categories);
};
const createCategory: RequestHandler<{}, categoryDTO, categoryInputDTO> = async (req, res, next) => {
  const { body } = req;
  const categoryExist = await Category.findOne({ name: body.name });
  if (categoryExist) throw new Error('Category already exists', { cause: { status: 409 } });

  const category = await Category.create(body satisfies categoryInputDTO);
  res.status(201).json(category);
};

const getCategory: RequestHandler<IdParams, categoryDTO> = async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id).lean();
  if (!category) throw Error('Category not found', { cause: { status: 401 } });
  res.json(category);
};

const updateCategory: RequestHandler<IdParams, categoryDTO, categoryInputDTO> = async (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;

  const category = await Category.findById(id);
  if (!category) throw Error('Category not found', { cause: { status: 401 } });

  category.name = name;
  await category.save();
  res.json(category);
};

const deleteCategory: RequestHandler<IdParams> = async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById(id);
  if (!category) throw Error('Category not found', { cause: { status: 401 } });

  await category.deleteOne();
  res.status(200).json({ message: 'Category deleted' });
};

export { deleteCategory, updateCategory, getCategory, createCategory, getAllCategries };
