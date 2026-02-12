import { getAllCategries, createCategory, updateCategory, deleteCategory, getCategory } from '#controllers';
import { validateBody } from '#middleware';
import { categoryInputSchema } from '#schemas';
import { Router } from 'express';

const categoryRoutes = Router();

categoryRoutes.route('/').get(getAllCategries).post(validateBody(categoryInputSchema), createCategory);
categoryRoutes
  .route('/:id')
  .get(getCategory)
  .put(validateBody(categoryInputSchema), updateCategory)
  .delete(deleteCategory);
export default categoryRoutes;
