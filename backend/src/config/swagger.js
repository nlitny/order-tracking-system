const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Tracking API',
      version: '1.0.0',
      description: 'A comprehensive Order Tracking API with customer media upload capabilities.',
      contact: {
        name: 'API Support',
        email: 'sadafpoorjab@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server'
      },
      {
        url: `https://api.yourdomain.com`,
        description: 'Production server'
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
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required or token invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              examples: {
                no_token: {
                  summary: 'No token provided',
                  value: {
                    success: false,
                    message: 'Authentication required',
                    error: 'UNAUTHORIZED'
                  }
                },
                invalid_token: {
                  summary: 'Invalid or expired token',
                  value: {
                    success: false,
                    message: 'Invalid or expired token',
                    error: 'TOKEN_INVALID'
                  }
                }
              }
            }
          }
        },
        ForbiddenError: {
          description: 'Access denied - insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        RateLimitError: {
          description: 'Too many requests - rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ConflictError: {
          description: 'Resource conflict - duplicate or constraint violation',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            error: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            details: {
              type: 'object',
              additionalProperties: true
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            path: {
              type: 'string',
              example: '/api/v1/orders'
            },
            requestId: {
              type: 'string',
              example: 'req-123456789'
            }
          },
          required: ['success', 'message', 'error']
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              additionalProperties: true
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                },
                requestId: {
                  type: 'string'
                },
                version: {
                  type: 'string'
                }
              }
            }
          },
          required: ['success', 'message']
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              minimum: 1
            },
            totalPages: {
              type: 'integer',
              minimum: 0
            },
            totalItems: {
              type: 'integer',
              minimum: 0
            },
            hasNext: {
              type: 'boolean'
            },
            hasPrev: {
              type: 'boolean'
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100
            }
          },
          required: ['currentPage', 'totalPages', 'totalItems', 'hasNext', 'hasPrev', 'limit']
        }
      },
      parameters: {
        OrderId: {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          example: 'clx9876543210'
        },
        MediaId: {
          in: 'path',
          name: 'mediaId',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          example: 'clm9876543210'
        },
        PageParam: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        StatusFilter: {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD']
          }
        },
        SearchParam: {
          in: 'query',
          name: 'search',
          schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management endpoints.'
      },
      {
        name: 'Orders',
        description: 'Complete order management system with CRUD operations.'
      },
      {
        name: 'Customer Media',
        description: 'Customer media file upload and management system.'
      },
      {
        name: 'Admin',
        description: 'Admin management endpoints.'
      },
      {
        name: 'Admin Media Files',
        description: 'Admin/Staff media file management system.'
      },
      {
        name: 'Users',
        description: 'Update user role by Admin and customer dashboard endpoints.'
      },
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
