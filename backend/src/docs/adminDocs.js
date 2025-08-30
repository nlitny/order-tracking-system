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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - only ADMIN allowed
 *       500:
 *         description: Internal server error
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
 *                           email:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           role:
 *                             type: string
 *                           isActive:
 *                             type: boolean
 *                           _count:
 *                             type: object
 *                             properties:
 *                               orders:
 *                                 type: integer
 *                           orders:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 orderNumber:
 *                                   type: string
 *                                 title:
 *                                   type: string
 *                                 status:
 *                                   type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalUsers:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPreviousPage:
 *                           type: boolean
 */

/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     description: Retrieve comprehensive dashboard data for admin panel
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
 *                         pending:
 *                           type: integer
 *                         inProgress:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                     users:
 *                       type: object
 *                       properties:
 *                         admins:
 *                           type: integer
 *                         staff:
 *                           type: integer
 *                         customers:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                     recentOrders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           orderNumber:
 *                             type: string
 *                           title:
 *                             type: string
 *                           status:
 *                             type: string
 *                           customer:
 *                             type: object
 *                             properties:
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 */
