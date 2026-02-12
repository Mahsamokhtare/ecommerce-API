import '#db';
import { errorHandler } from '#middleware';
import { categoryRoutes, orderRoutes, productRoutes, userRoutes } from '#routers';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use(errorHandler);

app.listen(port, () => console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`));
