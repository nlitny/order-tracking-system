/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterAdminRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@example.com"
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Alice"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Johnson"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "SecurePass123!"
 *         rePassword:
 *           type: string
 *           minLength: 6
 *           example: "SecurePass123!"
 *         role:
 *           type: string
 *           enum: [ADMIN, STAFF]
 *           example: "STAFF"
 *           description: "User role - can be either ADMIN or STAFF"
 *       required: ["email", "firstName", "lastName", "password", "rePassword", "role"]
 *       additionalProperties: false
 *       description: "All fields are required. Password and rePassword must match. Role must be ADMIN or STAFF."
 */

/**
 * @swagger
 * /api/v1/admin/register:
 *   post:
 *     summary: Register a new admin or staff (Admin only)
 *     description: Allows an existing ADMIN to create another ADMIN or STAFF account.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdminRequest'
 *           examples:
 *             register_admin:
 *               summary: Register new admin
 *               value:
 *                 email: "admin2@example.com"
 *                 firstName: "John"
 *                 lastName: "Smith"
 *                 password: "StrongPass123"
 *                 rePassword: "StrongPass123"
 *                 role: "ADMIN"
 *             register_staff:
 *               summary: Register new staff
 *               value:
 *                 email: "staff@example.com"
 *                 firstName: "Jane"
 *                 lastName: "Doe"
 *                 password: "StaffPass123"
 *                 rePassword: "StaffPass123"
 *                 role: "STAFF"
 *     responses:
 *       201:
 *         description: Admin/Staff registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             examples:
 *               admin_created:
 *                 summary: Admin created
 *                 value:
 *                   success: true
 *                   message: "ADMIN registered successfully"
 *                   data:
 *                     user:
 *                       id: "clx1234567890"
 *                       email: "admin2@example.com"
 *                       firstName: "John"
 *                       lastName: "Smith"
 *                       role: "ADMIN"
 *                       createdAt: "2025-08-29T10:30:00.000Z"
 *               staff_created:
 *                 summary: Staff created
 *                 value:
 *                   success: true
 *                   message: "STAFF registered successfully"
 *                   data:
 *                     user:
 *                       id: "clx1234567891"
 *                       email: "staff@example.com"
 *                       firstName: "Jane"
 *                       lastName: "Doe"
 *                       role: "STAFF"
 *                       createdAt: "2025-08-29T10:30:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_role:
 *                 summary: Invalid role
 *                 value:
 *                   success: false
 *                   message: "Role must be either ADMIN or STAFF"
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: "All fields are required"
 *               password_mismatch:
 *                 summary: Password mismatch
 *                 value:
 *                   success: false
 *                   message: "Passwords do not match"
 *               email_exists:
 *                 summary: Email already exists
 *                 value:
 *                   success: false
 *                   message: "Email already exists"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Access token required"
 *       403:
 *         description: Forbidden - only ADMIN allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Access denied. Required roles: ADMIN"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users with their orders (Admin only)
 *     description: Retrieve a paginated list of all users with their order information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in firstName, lastName, email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [CUSTOMER, STAFF, ADMIN]
 *         description: Filter by user role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by user active status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Users with orders retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "clx1234567890"
 *                           email:
 *                             type: string
 *                             example: "user@example.com"
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           lastName:
 *                             type: string
 *                             example: "Doe"
 *                           phone:
 *                             type: string
 *                             nullable: true
 *                             example: "+1234567890"
 *                           profilePicture:
 *                             type: string
 *                             nullable: true
 *                             example: "https://cloudinary.com/image.jpg"
 *                           role:
 *                             type: string
 *                             enum: [CUSTOMER, STAFF, ADMIN]
 *                             example: "CUSTOMER"
 *                           isActive:
 *                             type: boolean
 *                             example: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-08-29T10:30:00.000Z"
 *                           _count:
 *                             type: object
 *                             properties:
 *                               orders:
 *                                 type: integer
 *                                 example: 5
 *                           orders:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   example: "clx1234567891"
 *                                 orderNumber:
 *                                   type: string
 *                                   example: "ORD-20250829-123456ABC"
 *                                 title:
 *                                   type: string
 *                                   example: "Custom Website Design"
 *                                 status:
 *                                   type: string
 *                                   enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *                                   example: "IN_PROGRESS"
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-08-29T10:30:00.000Z"
 *                                 estimatedCompletion:
 *                                   type: string
 *                                   format: date-time
 *                                   nullable: true
 *                                   example: "2025-09-15T18:00:00.000Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalUsers:
 *                           type: integer
 *                           example: 45
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPreviousPage:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only ADMIN allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve comprehensive dashboard data for admin panel including order statistics, user counts, and recent orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin dashboard data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 150
 *                         pending:
 *                           type: integer
 *                           example: 25
 *                         inProgress:
 *                           type: integer
 *                           example: 45
 *                         completed:
 *                           type: integer
 *                           example: 75
 *                     users:
 *                       type: object
 *                       properties:
 *                         admins:
 *                           type: integer
 *                           example: 2
 *                         staff:
 *                           type: integer
 *                           example: 5
 *                         customers:
 *                           type: integer
 *                           example: 120
 *                         total:
 *                           type: integer
 *                           example: 127
 *                     recentOrders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "clx1234567890"
 *                           orderNumber:
 *                             type: string
 *                             example: "ORD-20250829-123456ABC"
 *                           title:
 *                             type: string
 *                             example: "Custom Website Design"
 *                           status:
 *                             type: string
 *                             enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *                             example: "PENDING"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-08-29T10:30:00.000Z"
 *                           customer:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "clx1234567891"
 *                               firstName:
 *                                 type: string
 *                                 example: "John"
 *                               lastName:
 *                                 type: string
 *                                 example: "Doe"
 *                               email:
 *                                 type: string
 *                                 example: "john.doe@example.com"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - only ADMIN allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
