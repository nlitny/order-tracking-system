
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRoleRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "clx1234567890"
 *         role:
 *           type: string
 *           enum: [CUSTOMER, STAFF, ADMIN]
 *           example: "STAFF"
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: "Optional field to update user active status"
 *       required: ["userId", "role"]
 */

/**
 * @swagger
 * /api/v1/users/role:
 *   patch:
 *     summary: Update user role and status (Admin only)
 *     description: Update a user's role and optionally their active status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRoleRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 */

/**
 * @swagger
 * /api/v1/users/dashboard:
 *   get:
 *     summary: Get customer dashboard statistics
 *     description: Retrieve dashboard data for logged-in customer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer dashboard data retrieved successfully
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
 *                   example: "Customer dashboard data retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 10
 *                         pending:
 *                           type: integer
 *                           example: 3
 *                         inProgress:
 *                           type: integer
 *                           example: 2
 *                         completed:
 *                           type: integer
 *                           example: 5
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
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 */
