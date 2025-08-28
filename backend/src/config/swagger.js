const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Tracking API',
      version: '1.0.0',
      description: `
        A comprehensive Order Tracking API with customer media upload capabilities.
        
        ## Features
        - **JWT Authentication** & Authorization with refresh tokens
        - **Order Management** with complete CRUD operations
        - **Customer Media Upload** via Cloudinary integration
        - **Role-based Access Control** (Customer, Staff, Admin)
        - **Order Status Tracking** with detailed history
        - **File Upload Validation** with size and type constraints
        - **Rate Limiting** and Security middleware
        
        ## Authentication
        All endpoints require JWT authentication. Include the token in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`
        
        Alternatively, you can use API Key authentication:
        \`x-api-key: <your-api-key>\`
        
        ## Order Status Flow
        - **PENDING**: Order created, awaiting processing, customer can update/cancel
        - **IN_PROGRESS**: Work has begun, customer can cancel but not update
        - **COMPLETED**: Order finished, media files visible to customer
        - **CANCELLED**: Order cancelled by customer or staff
        - **ON_HOLD**: Order temporarily paused, requires staff intervention
        
        ## File Upload System
        - **Supported formats**: Images (JPG, PNG, GIF), Videos (MP4, MOV, AVI), Documents (PDF)
        - **Individual file limit**: 5MB maximum per file
        - **Total upload limit**: 10MB per request (multiple files)
        - **Maximum files**: 10 files per upload request
        - **Storage**: Secure cloud storage via Cloudinary
        - **Access control**: Customer files always visible, staff files visible when completed
        
        ## API Workflow
        1. **Authentication**: Register/login to get JWT tokens
        2. **Create Order**: Submit new order with title and description
        3. **Upload Media**: Add supporting files (requirements, references, mockups)
        4. **Track Progress**: Monitor order status and view history
        5. **View Results**: Access completed work and staff-uploaded files
        
        ## Rate Limiting
        - **General limit**: 100 requests per 15 minutes per IP
        - **Upload limit**: Special handling for file uploads
        - **429 status code** returned when limits exceeded
        
        ##  Security Features
        - JWT tokens with expiration
        - Refresh token rotation
        - Role-based permissions
        - Input validation and sanitization
        - File type and size validation
        - Secure headers with Helmet.js
      `,
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
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login/register endpoints'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for server-to-server authentication'
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
                },
                token_expired: {
                  summary: 'Token expired',
                  value: {
                    success: false,
                    message: 'Token has expired',
                    error: 'TOKEN_EXPIRED',
                    details: {
                      expiredAt: '2025-08-28T10:30:00.000Z'
                    }
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
              },
              examples: {
                access_denied: {
                  summary: 'Insufficient permissions',
                  value: {
                    success: false,
                    message: 'Access denied. You do not have permission to perform this action',
                    error: 'FORBIDDEN'
                  }
                },
                wrong_role: {
                  summary: 'Wrong user role',
                  value: {
                    success: false,
                    message: 'This action requires ADMIN or STAFF role',
                    error: 'INSUFFICIENT_ROLE',
                    details: {
                      requiredRoles: ['ADMIN', 'STAFF'],
                      userRole: 'CUSTOMER'
                    }
                  }
                }
              }
            }
          }
        },
        RateLimitError: {
          description: 'Too many requests - rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ErrorResponse' },
                  {
                    type: 'object',
                    properties: {
                      retryAfter: {
                        type: 'integer',
                        description: 'Seconds to wait before next request',
                        example: 900
                      }
                    }
                  }
                ]
              },
              examples: {
                rate_limit_exceeded: {
                  summary: 'Rate limit exceeded',
                  value: {
                    success: false,
                    message: 'Too many requests, please try again later',
                    error: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: 900
                  }
                },
                upload_limit: {
                  summary: 'Upload rate limit exceeded',
                  value: {
                    success: false,
                    message: 'Too many file upload requests',
                    error: 'UPLOAD_RATE_LIMIT',
                    retryAfter: 300,
                    details: {
                      limit: '5 uploads per minute',
                      windowMs: 60000
                    }
                  }
                }
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
              },
              examples: {
                missing_field: {
                  summary: 'Required field missing',
                  value: {
                    success: false,
                    message: 'Order title is required',
                    error: 'VALIDATION_ERROR',
                    details: {
                      field: 'title',
                      code: 'REQUIRED'
                    }
                  }
                },
                invalid_format: {
                  summary: 'Invalid field format',
                  value: {
                    success: false,
                    message: 'Invalid email format',
                    error: 'VALIDATION_ERROR',
                    details: {
                      field: 'email',
                      code: 'INVALID_FORMAT',
                      value: 'invalid-email'
                    }
                  }
                },
                multiple_errors: {
                  summary: 'Multiple validation errors',
                  value: {
                    success: false,
                    message: 'Multiple validation errors',
                    error: 'VALIDATION_ERROR',
                    details: [
                      {
                        field: 'title',
                        code: 'MIN_LENGTH',
                        message: 'Title must be at least 3 characters'
                      },
                      {
                        field: 'email',
                        code: 'INVALID_FORMAT',
                        message: 'Invalid email format'
                      }
                    ]
                  }
                }
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
              },
              examples: {
                order_not_found: {
                  summary: 'Order not found',
                  value: {
                    success: false,
                    message: 'Order not found',
                    error: 'NOT_FOUND',
                    details: {
                      resource: 'order',
                      id: 'clx9876543210'
                    }
                  }
                },
                user_not_found: {
                  summary: 'User not found',
                  value: {
                    success: false,
                    message: 'User not found',
                    error: 'NOT_FOUND',
                    details: {
                      resource: 'user'
                    }
                  }
                }
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
              },
              examples: {
                duplicate_email: {
                  summary: 'Email already exists',
                  value: {
                    success: false,
                    message: 'Email address already registered',
                    error: 'DUPLICATE_RESOURCE',
                    details: {
                      field: 'email',
                      conflict: 'UNIQUE_CONSTRAINT'
                    }
                  }
                },
                business_rule: {
                  summary: 'Business rule violation',
                  value: {
                    success: false,
                    message: 'Order cannot be updated when status is COMPLETED',
                    error: 'BUSINESS_RULE_ERROR',
                    details: {
                      currentStatus: 'COMPLETED',
                      allowedStatuses: ['PENDING']
                    }
                  }
                }
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
              },
              examples: {
                server_error: {
                  summary: 'Generic server error',
                  value: {
                    success: false,
                    message: 'Internal server error occurred',
                    error: 'INTERNAL_ERROR'
                  }
                },
                database_error: {
                  summary: 'Database connection error',
                  value: {
                    success: false,
                    message: 'Database connection failed',
                    error: 'DATABASE_ERROR'
                  }
                },
                external_service_error: {
                  summary: 'External service error',
                  value: {
                    success: false,
                    message: 'File upload service temporarily unavailable',
                    error: 'EXTERNAL_SERVICE_ERROR',
                    details: {
                      service: 'cloudinary',
                      retryable: true
                    }
                  }
                }
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
              example: false,
              description: 'Indicates if the request was successful'
            },
            message: {
              type: 'string',
              example: 'An error occurred',
              description: 'Human-readable error message'
            },
            error: {
              type: 'string',
              example: 'VALIDATION_ERROR',
              description: 'Error code for programmatic handling'
            },
            details: {
              type: 'object',
              additionalProperties: true,
              example: {
                field: 'email',
                code: 'INVALID_FORMAT'
              },
              description: 'Additional error details'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-28T10:30:00.000Z',
              description: 'Error occurrence timestamp'
            },
            path: {
              type: 'string',
              example: '/api/v1/orders',
              description: 'API endpoint that generated the error'
            },
            requestId: {
              type: 'string',
              example: 'req-123456789',
              description: 'Unique request identifier for debugging'
            }
          },
          required: ['success', 'message', 'error']
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
              description: 'Indicates successful request'
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully',
              description: 'Success message'
            },
            data: {
              type: 'object',
              additionalProperties: true,
              description: 'Response payload'
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-08-28T10:30:00.000Z'
                },
                requestId: {
                  type: 'string',
                  example: 'req-123456789'
                },
                version: {
                  type: 'string',
                  example: '1.0.0'
                }
              },
              description: 'Response metadata'
            }
          },
          required: ['success', 'message']
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            currentPage: {
              type: 'integer',
              minimum: 1,
              example: 1,
              description: 'Current page number'
            },
            totalPages: {
              type: 'integer',
              minimum: 0,
              example: 5,
              description: 'Total number of pages'
            },
            totalItems: {
              type: 'integer',
              minimum: 0,
              example: 47,
              description: 'Total number of items'
            },
            hasNext: {
              type: 'boolean',
              example: true,
              description: 'Whether there is a next page'
            },
            hasPrev: {
              type: 'boolean',
              example: false,
              description: 'Whether there is a previous page'
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              example: 10,
              description: 'Items per page'
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
          description: 'Order unique identifier',
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
          description: 'Media file unique identifier',
          example: 'clm9876543210'
        },
        PageParam: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          description: 'Page number for pagination',
          example: 1
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          },
          description: 'Number of items per page',
          example: 10
        },
        StatusFilter: {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD']
          },
          description: 'Filter by order status',
          example: 'PENDING'
        },
        SearchParam: {
          in: 'query',
          name: 'search',
          schema: {
            type: 'string',
            minLength: 1,
            maxLength: 100
          },
          description: 'Search term for filtering results',
          example: 'website development'
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
        description: `
          User authentication and profile management endpoints.
          
          **Features:**
          - Multi-stage authentication (email check → login/register)
          - JWT tokens with refresh capability
          - Profile management and password changes
          - Role-based access control
          
          **Security:**
          - Bcrypt password hashing
          - JWT token expiration and refresh
          - Rate limiting on auth endpoints
          - Input validation and sanitization
        `
      },
      {
        name: 'Orders',
        description: `
          Complete order management system with CRUD operations.
          
          **Order Lifecycle:**
          1. Customer creates order (PENDING status)
          2. Staff begins processing (IN_PROGRESS status)
          3. Work completed (COMPLETED status)
          4. Customer can view results
          
          **Customer Capabilities:**
          - Create new orders
          - Update orders (PENDING only)
          - Cancel orders (PENDING/IN_PROGRESS only)
          - View own orders and history
          
          **Status Management:**
          - Automatic order numbering (ORD-YYYYMMDD-XXXXX)
          - Complete history tracking
          - Status-based business rules
          - Conditional media file access
        `
      },
      {
        name: 'Customer Media',
        description: `
          Customer media file upload and management system.
          
          **File Upload:**
          - Cloudinary integration for secure storage
          - Multiple file formats (images, videos, documents)
          - Size and type validation
          - Batch upload support (up to 10 files)
          
          **Access Control:**
          - Customer files always visible to order owner
          - ADMIN/STAFF can view all customer media
          - File deletion only allowed for PENDING orders
          - Automatic cleanup on failed uploads
          
          **Use Cases:**
          - Upload project requirements
          - Share reference materials
          - Provide examples or mockups
          - Submit supporting documentation
        `
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
