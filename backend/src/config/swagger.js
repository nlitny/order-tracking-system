const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Tracking API',
      version: '1.0.0',
      description: 'API for order tracking system with media upload capabilities',
      contact: {
        name: 'API Support',
        email: 'sadafpoorjab@gmail.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './src/routes/*.js',
    './src/docs/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec };