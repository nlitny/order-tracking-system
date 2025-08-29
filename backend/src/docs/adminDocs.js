/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin management endpoints
 */

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
 *       required: ["email", "firstName", "lastName", "password", "rePassword"]
 *       additionalProperties: false
 *       description: "All fields are required. Password and rePassword must match."
 */

/**
 * @swagger
 * /api/v1/admin/register:
 *   post:
 *     summary: Register a new admin (Admin only)
 *     description: Allows an existing ADMIN to create another ADMIN account.
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
 *             valid_request:
 *               summary: Valid registration
 *               value:
 *                 email: "admin2@example.com"
 *                 firstName: "John"
 *                 lastName: "Smith"
 *                 password: "StrongPass123"
 *                 rePassword: "StrongPass123"
 *             password_mismatch:
 *               summary: Password mismatch
 *               value:
 *                 email: "admin2@example.com"
 *                 firstName: "John"
 *                 lastName: "Smith"
 *                 password: "StrongPass123"
 *                 rePassword: "WrongPass456"
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Admin registered successfully"
 *               data:
 *                 user:
 *                   id: "clx1234567890"
 *                   email: "admin2@example.com"
 *                   firstName: "John"
 *                   lastName: "Smith"
 *                   role: "ADMIN"
 *                   createdAt: "2025-08-29T10:30:00.000Z"
 *       400:
 *         description: Validation error (e.g., duplicate email, missing fields, password mismatch)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_fields:
 *                 summary: Missing required fields
 *                 value:
 *                   success: false
 *                   message: "All fields are required"
 *               duplicate_email:
 *                 summary: Duplicate email
 *                 value:
 *                   success: false
 *                   message: "Email already exists"
 *               password_mismatch:
 *                 summary: Password mismatch
 *                 value:
 *                   success: false
 *                   message: "Passwords do not match"
 *       401:
 *         description: Unauthorized - invalid or missing token
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
