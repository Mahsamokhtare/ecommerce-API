import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from '#controllers';
import { validateBody } from '#middleware';
import { orderInputSchema } from '#schemas';
import { Router } from 'express';

const orderRoutes = Router();

orderRoutes.route('/').post(validateBody(orderInputSchema), createOrder).get(getAllOrders);
orderRoutes.route('/:id').get(getOrder).put(validateBody(orderInputSchema), updateOrder).delete(deleteOrder);

export default orderRoutes;
