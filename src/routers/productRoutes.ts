import { createProduct, deleteProduct, getAllProdcuts, getProduct, updateProduct } from '#controllers';
import { validateBody } from '#middleware';
import { productInputSchema } from '#schemas';
import { Router } from 'express';

const productRoutes = Router();
productRoutes.route('/').post(validateBody(productInputSchema), createProduct).get(getAllProdcuts);
productRoutes.route('/:id').put(validateBody(productInputSchema), updateProduct).get(getProduct).delete(deleteProduct);

export default productRoutes;
