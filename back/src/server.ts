import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';

import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './swagger/swagger.config';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRouter);

app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
