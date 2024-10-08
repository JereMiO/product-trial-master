import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Alten E-commerce API',
            version: '1.0.0',
            description: 'API for Alten E-commerce platform',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
