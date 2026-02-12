import { Order, Product } from '#models';
import type { orderInputSchema, orderSchema, populatedUserSchema, populatedProductSchema } from '#schemas';
import type { RequestHandler } from 'express';
import type z from 'zod';

type OrderInputDTO = z.infer<typeof orderInputSchema>;
type OrderDTO = z.infer<typeof orderSchema>;
type populatedUserDTO = z.infer<typeof populatedUserSchema>;
type populatedProductDTO = z.infer<typeof populatedProductSchema>;
type IdParams = { id: string };

const createOrder: RequestHandler = async (req, res) => {
  const { userId, products } = req.body;

  const productsId = products.map((p: { productId: string }) => p.productId);

  const dbProducts = await Product.find({ _id: { $in: productsId } });

  let calculatedTotal = 0;
  const orderItems = products.map((item: { productId: string; quantity: number }) => {
    const productInfo = dbProducts.find(p => p._id.toString() === item.productId);

    if (!productInfo) {
      throw new Error(`Product ${item.productId} not found`, { cause: { status: 404 } });
    }

    calculatedTotal += productInfo.price * item.quantity;
    console.log('This is caculated', calculatedTotal);

    return item;
  });
  const order = await Order.create({
    userId,
    products: orderItems,
    total: calculatedTotal
  });
  const populatedOrder = await Order.findById(order._id)
    .populate('userId', 'name email')
    .populate('products.productId', 'name price');
  res.status(201).json(populatedOrder);
};

const getOrder: RequestHandler<IdParams, OrderDTO> = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id)
    .populate<{ userId: populatedUserDTO }>('userId', 'name email')
    // Corrected the generic to match the array structure
    .populate<{ products: { productId: populatedProductDTO; quantity: number }[] }>('products.productId', 'name price')
    .lean();
  if (!order) throw Error('Order not found', { cause: { status: 401 } });
  res.json(order as unknown as OrderDTO);
};

const deleteOrder: RequestHandler<IdParams> = async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  await order.deleteOne();
  res.json({ message: 'order delted' });
};

const updateOrder: RequestHandler<IdParams, OrderDTO, OrderInputDTO> = async (req, res) => {
  const { id } = req.params;
  const { products, userId } = req.body;

  const productIds = products.map((p: { productId: any }) => p.productId);
  const dbProducts = await Product.find({ _id: { $in: productIds } });

  let newTotal = 0;

  products.forEach((item: { productId: string; quantity: number }) => {
    const productInfo = dbProducts.find(p => p._id.toString() === item.productId);

    if (!productInfo) {
      throw new Error(`Product ${item.productId} not found`, {
        cause: { status: 404 }
      });
    }

    newTotal += productInfo.price * item.quantity;
  });

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      userId,
      products,
      total: newTotal
    },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }
  // Populate on the query and return a plain object with `lean()` so the
  // response body matches the `OrderDTO` type (avoids Mongoose Document types)
  const result = await Order.findByIdAndUpdate(
    id,
    {
      userId,
      products,
      total: newTotal
    },
    { new: true, runValidators: true }
  )
    .populate<{
      userId: populatedUserDTO;
      products: { productId: populatedProductDTO; quantity: number }[];
    }>('userId', 'name email')
    .populate('products.productId', 'name price')
    .lean();

  if (!result) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  res.json(result as unknown as OrderDTO);
};

const getAllOrders: RequestHandler<{}, OrderDTO[]> = async (req, res) => {
  const orders = await Order.find()
    .populate<{
      userId: populatedUserDTO;
      products: { productId: populatedProductDTO; quantity: number }[];
    }>('userId', 'name email')
    .populate('products.productId', 'name price')
    .lean();

  res.json(orders as unknown as OrderDTO[]);
};
export { createOrder, getOrder, deleteOrder, updateOrder, getAllOrders };
