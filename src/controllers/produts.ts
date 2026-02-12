import { Product } from '#models';
import { populatedCategorySchema, type productInputSchema, type productSchema } from '#schemas';
import type { RequestHandler } from 'express';
import type { Types } from 'mongoose';
import type { z } from 'zod/v4';

type productInputDTO = z.infer<typeof productInputSchema>;
type productDTO = z.infer<typeof productSchema>;
type populdatedCategoryDTO = z.infer<typeof populatedCategorySchema>;
type IdParams = { id: string };

const createProduct: RequestHandler<{}, productDTO, productInputDTO> = async (req, res) => {
  const body = req.body;
  const productExists = await Product.findOne({ name: body.name });
  if (productExists) throw new Error('Product already exists', { cause: { status: 409 } });
  const product = await Product.create(body satisfies productInputDTO);
  const populatedProduct = await product.populate<{
    categoryId: populdatedCategoryDTO;
  }>('categoryId', 'name');
  res.json(populatedProduct).status(201);
};

const getProduct: RequestHandler<IdParams, productDTO> = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate<{ categoryId: populdatedCategoryDTO }>('categoryId', 'name');
  if (!product) throw Error('Product not found', { cause: { status: 401 } });
  res.json(product);
};

const updateProduct: RequestHandler<IdParams, productDTO, productInputDTO> = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found', { cause: { status: 404 } });
  product.name = body.name;
  product.description = body.description;
  product.price = body.price;
  product.categoryId = body.categoryId as unknown as Types.ObjectId;

  await product.save();

  const populatedProdcut = await product.populate<{ categoryId: populdatedCategoryDTO }>('categoryId', 'name');

  res.json(populatedProdcut);
};

const deleteProduct: RequestHandler<IdParams> = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found', { cause: { status: 404 } });
  await product.deleteOne();
  res.status(200).json({ message: 'Prodcut deleted' });
};

const getAllProdcuts: RequestHandler<{}, productDTO[]> = async (req, res) => {
  const products = await Product.find().populate<{ categoryId: populdatedCategoryDTO }>('categoryId', 'name');
  res.json(products);
};

export { createProduct, getProduct, updateProduct, deleteProduct, getAllProdcuts };
