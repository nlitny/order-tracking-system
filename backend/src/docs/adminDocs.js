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
