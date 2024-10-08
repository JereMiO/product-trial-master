import express, {Request, Response, Router} from 'express';
import fs from 'fs/promises';
import path from 'path';
import {Product} from '../models/product';

const router: Router = express.Router();
const dataPath = path.join(__dirname, '..', 'data.json');

// Helper function to read data
const readData = async (): Promise<{ products: Product[] }> => {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write data
const writeData = async (data: { products: Product[] }): Promise<void> => {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         inventoryStatus:
 *           type: string
 *           enum: [INSTOCK, LOWSTOCK, OUTOFSTOCK]
 *           description: The inventory status of the product
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns the list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        res.json(data.products);
    } catch (err) {
        res.status(500).json({error: 'Error reading data'});
    }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        const product = data.products.find(p => p.id === parseInt(req.params.id));
        if (!product) {
            res.status(404).json({error: 'Product not found'});
            return;
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({error: 'Error reading data'});
    }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        const newProduct: Product = {
            id: data.products.length + 1,
            ...req.body
        };
        data.products.push(newProduct);
        await writeData(data);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({error: 'Error writing data'});
    }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
        if (productIndex === -1) {
            res.status(404).json({error: 'Product not found'});
            return;
        }
        data.products[productIndex] = {...data.products[productIndex], ...req.body};
        await writeData(data);
        res.json(data.products[productIndex]);
    } catch (err) {
        res.status(500).json({error: 'Error writing data'});
    }
});

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update part of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
        if (productIndex === -1) {
            res.status(404).json({error: 'Product not found'});
            return;
        }

        // Update only the fields provided in the request body
        const updatedProduct = {...data.products[productIndex], ...req.body};

        // Ensure the ID is not changed
        updatedProduct.id = data.products[productIndex].id;

        data.products[productIndex] = updatedProduct;
        await writeData(data);
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({error: 'Error updating data'});
    }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove the product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       204:
 *         description: The product was deleted
 *       404:
 *         description: The product was not found
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await readData();
        const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
        if (productIndex === -1) {
            res.status(404).json({error: 'Product not found'});
            return;
        }
        data.products.splice(productIndex, 1);
        await writeData(data);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({error: 'Error writing data'});
    }
});

export default router;
