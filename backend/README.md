
#  Order Status Tracking System

A comprehensive **Order Tracking System** designed for managing spell orders with real-time status updates, secure file management, and role-based access control. Built with modern technologies and enterprise-grade security.

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)

##  Features

### **Order Status Tracking**
- **Real-time status updates**: `PENDING` → `IN_PROGRESS` → `COMPLETED`
- **Comprehensive order history** with timestamps
- **Smart notifications** for status changes
- **Advanced search & filter** functionality

### **Media Management**
- **Secure file storage** via Cloudinary integration
- **Multi-format support**: Images, Videos, Documents
- **Staff media uploads** with progress reports
- **Customer access** to completed order files

###  **Security & Authentication**
- **JWT-based authentication** with refresh tokens
- **Role-based access control** (Customer/Staff/Admin)
- **Rate limiting** and request validation
- **Password encryption** with bcryptjs

###  **Admin Dashboard**
- **User management** with role assignments
- **Order analytics** and reporting
- **System health monitoring**
- **Comprehensive logging**

##  Technology Stack

### **Backend Core**
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **Prisma 6.14.0** - Next-generation ORM
- **PostgreSQL** - Reliable relational database

### **Authentication & Security**
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet.js** - HTTP security headers
- **express-rate-limit** - Request rate limiting
- **CORS** - Cross-origin resource sharing

### **File Management**
- **Cloudinary** - Cloud-based file storage
- **Multer** - Multipart form data handling
- **Sharp** - High-performance image processing

### **Documentation & Validation**
- **Swagger UI** - Interactive API documentation
- **express-validator** - Server-side validation
- **Winston** - Advanced logging system

### **Performance & Utilities**
- **Redis** - In-memory caching
- **Compression** - Response compression
- **Morgan** - HTTP request logger
- **UUID** - Unique identifier generation

##  Quick Start

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (optional, for caching)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/order-tracking-system.git
cd order-tracking-system

### 2. Install Dependencies

bash
npm install

### 3. Environment Configuration

Create a `.env` file in the root directory:

env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/order_tracking_db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

# Server Configuration
NODE_ENV="development"
PORT="3000"
API_KEY="your-api-key-for-admin-endpoints"

# File Upload Configuration
MAX_FILE_SIZE="5242880"  # 5MB in bytes
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,video/mp4,application/pdf"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"  # 15 minutes
RATE_LIMIT_MAX_REQUESTS="100"

# Redis (Optional)
REDIS_URL="redis://localhost:6379"

### 4. Database Setup

bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run seed

### 5. Start the Application

#### Development Mode
bash
npm run dev

#### Production Mode
bash
npm start

The server will start on `http://localhost:3000`

##  API Documentation

### **Interactive Documentation**
Visit `http://localhost:3000/api-docs` for comprehensive Swagger UI documentation with:
- **Interactive testing interface**
- **Complete endpoint descriptions**
- **Request/response examples**
- **Schema definitions**

### **Health Check**
bash
GET /health
Returns server status and system information.

##  API Endpoints Overview

### **Authentication** (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh` - Token refresh
- `POST /logout` - User logout

### **Orders** (`/api/v1/orders`)
- `GET /orders` - List orders (with pagination & filters)
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order details
- `PUT /orders/:id` - Update order
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id/cancel` - Cancel order

### **Media Files** (`/api/v1/orders/:id`)
- `POST /media` - Upload media files (Staff only)
- `GET /media` - Get order media files
- `POST /customer-media` - Upload customer files

### **User Management** (`/api/v1/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /change-password` - Change password
- `POST /upload-avatar` - Upload profile picture

### **Admin Panel** (`/api/v1/admin`)
- `GET /dashboard` - Admin dashboard stats
- `GET /users` - Manage users
- `GET /orders/analytics` - Order analytics
- `PATCH /users/:id/role` - Update user role

### **Notifications** (`/api/v1/notifications`)
- `GET /notifications` - Get user notifications
- `PATCH /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

## User Roles & Permissions

### ** CUSTOMER**
- Create and manage their own orders
- View order history and status
- Upload reference files
- Access completed order media
- Receive notifications

### ** STAFF**
- View all orders assigned to them
- Update order status
- Upload progress media files
- Add order notes and reports
- Manage order workflow

### ** ADMIN**
- Full system access
- User management and role assignment
- System analytics and reporting
- Global order management
- System configuration

## Order Status Workflow


PENDING → IN_PROGRESS → COMPLETED
   ↓           ↓
CANCELLED ← ON_HOLD

### Status Descriptions:
- **PENDING** - Order submitted, awaiting staff assignment
- **IN_PROGRESS** - Work has begun on the order
- **COMPLETED** - Order finished, media available to customer
- **CANCELLED** - Order cancelled by customer or admin
- **ON_HOLD** - Temporarily paused, awaiting information

## Database Schema

### **Core Models:**

prisma
// User Model
model User {
  id              String   @id @default(cuid())
  firstName       String
  lastName        String
  email           String   @unique
  password        String
  role            Role     @default(CUSTOMER)
  profilePicture  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  orders          Order[]
  notifications   Notification[]
}

// Order Model
model Order {
  id                   String      @id @default(cuid())
  orderNumber          String      @unique
  customerId           String
  title                String
  description          String
  status               OrderStatus @default(PENDING)
  special_instructions String?
  estimatedCompletion  DateTime?
  completedAt          DateTime?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  
  customer            User           @relation(fields: [customerId], references: [id])
  mediaFiles          MediaFile[]
  customerMedia       CustomerMedia[]
  orderHistory        OrderHistory[]
}

##  Available Scripts

bash
# Development
npm run dev              # Start development server with auto-reload
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:reset         # Reset database
npm run db:studio        # Open Prisma Studio
npm run seed             # Seed database with sample data

# Production
npm start                # Start production server
npm run build            # Build for production (if applicable)

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Apply migrations
npm run db:studio        # Database GUI

## Configuration

### **File Upload Settings**
javascript
const fileConfig = {
  maxSize: "5MB",           // Maximum file size
  allowedTypes: [           // Supported file types
    "image/jpeg", "image/png", "image/gif",
    "video/mp4", "application/pdf"
  ],
  storage: "cloudinary",    // Storage provider
  autoOptimize: true        // Auto image optimization
}

### **Rate Limiting**
javascript
const rateLimit = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Max 100 requests per window
  message: "Too many requests"
}

##  Testing

### **Manual Testing**
Use the Swagger UI interface at `http://localhost:3000/api-docs` to test endpoints interactively.

### **Example API Calls**

#### Create a New Order:
bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Website Development",
    "description": "Build a modern e-commerce website",
    "special_instructions": "Use React and Node.js",
    "estimatedCompletion": "2025-12-31T23:59:59.000Z"
  }'

#### Check Order Status:
bash
curl -X GET http://localhost:3000/api/v1/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages:

json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-08-30T10:30:00.000Z"
}

### **Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Monitoring & Logs

### **Health Check**
Monitor system health at `/health`:
json
{
  "status": "OK",
  "timestamp": "2025-08-30T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": "connected",
  "redis": "connected"
}

### **Logging**
Logs are written to:
- **Console** (development)
- **Files** (production)
- **Error tracking** service (optional)

##  Security Features

- **JWT Authentication** with refresh token rotation
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **Input Validation** on all endpoints
- **SQL Injection Protection** via Prisma ORM
- **XSS Prevention** through input sanitization
- **CORS Configuration** for cross-origin requests
- **Security Headers** via Helmet.js

##  Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### **Code Style Guidelines:**
- Use **Prettier** for code formatting
- Follow **ESLint** rules
- Write **descriptive commit messages**
- Add **comments** for complex logic

##  License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Author

**Sadaf PJ** - *Full Stack Developer*
- GitHub: [@sadafpj](https://github.com/sadafpj)
- Email: sadafpj@example.com

## Acknowledgments

- **Express.js** team for the excellent web framework
- **Prisma** for the amazing database toolkit
- **Cloudinary** for reliable file storage
- **JWT** community for secure authentication standards

## Support

If you encounter any issues or have questions:

1. **Check** the [documentation](http://localhost:3000/api-docs)
2. **Search** existing [issues](https://github.com/your-username/order-tracking-system/issues)
3. **Create** a new issue if needed
4. **Contact** support via email

---

## Deployment

### **Docker Deployment** (Coming Soon)
bash
# Build Docker image
docker build -t order-tracking-system .

# Run container
docker run -p 3000:3000 order-tracking-system

### **Production Checklist**
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up Cloudinary account
- [ ] Configure environment variables
- [ ] Set up SSL/HTTPS
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backups

---



