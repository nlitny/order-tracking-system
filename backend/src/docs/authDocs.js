/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProfileRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "John"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Smith"
 *         phone:
 *           type: string
 *           pattern: '^(\+98|0)?9\d{9}'
 *           example: "09123456789"
 *         email:
 *           type: string
 *           format: email
 *           example: "newemail@example.com"
 *       description: "At least one field is required. Only provided fields will be updated."
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clx1234567890"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         phone:
 *           type: string
 *           example: "09123456789"
 *           nullable: true
 *         role:
 *           type: string
 *           enum: [CUSTOMER, ADMIN, STAFF]
 *           example: "CUSTOMER"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "An error occurred"
 *         error:
 *           type: string
 *           example: "VALIDATION_ERROR"
 *         details:
 *           type: object
 *           additionalProperties: true
 *           example: 
 *             field: "email"
 *             code: "INVALID_FORMAT"
 *         retryAfter:
 *           type: number
 *           example: 900
 *           description: "Time in seconds to wait before retrying (for rate limiting)"
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           additionalProperties: true
 *
 *     AuthRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "password123"
 *         firstName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "John"
 *         lastName:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: "Doe"
 *         rePassword:
 *           type: string
 *           minLength: 6
 *           example: "password123"
 *       required: ["email"]
 *       description: "Email is always required. Other fields are required based on the authentication stage."
 *
 *     AuthTokens:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         accessTokenExpiresIn:
 *           type: string
 *           example: "15m"
 *         refreshTokenExpiresIn:
 *           type: string
 *           example: "7d"
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Authentication successful"
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [login, register, pending]
 *               example: "login"
 *             message:
 *               type: string
 *               example: "Login successful"
 *             user:
 *               $ref: '#/components/schemas/User'
 *             tokens:
 *               $ref: '#/components/schemas/AuthTokens'
 *             required_fields:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["password"]
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required: ["currentPassword", "newPassword"]
 *       properties:
 *         currentPassword:
 *           type: string
 *           minLength: 6
 *           example: "oldPassword123"
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           example: "newPassword456"
 *       description: "Both current and new passwords are required"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: "Enter your JWT token in the format: Bearer <token>"
 */

/**
 * @swagger
 * /api/v1/auth/profile:
 *   patch:
 *     summary: Update user profile (Partial Update)
 *     description: Update specific fields of the authenticated user's profile. Only the provided fields will be updated.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           examples:
 *             update_name_only:
 *               summary: Update name only
 *               value:
 *                 firstName: "John"
 *                 lastName: "Smith"
 *             update_phone_only:
 *               summary: Update phone only
 *               value:
 *                 phone: "09123456789"
 *             update_email_only:
 *               summary: Update email only
 *               value:
 *                 email: "newemail@example.com"
 *             partial_update:
 *               summary: Partial update
 *               value:
 *                 firstName: "Ahmad"
 *                 phone: "09123456789"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error or duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_fields:
 *                 summary: No fields provided
 *                 value:
 *                   success: false
 *                   message: "At least one field is required to update"
 *               duplicate_email:
 *                 summary: Email already exists
 *                 value:
 *                   success: false
 *                   message: "Email already exists"
 *               invalid_phone:
 *                 summary: Invalid phone format
 *                 value:
 *                   success: false
 *                   message: "Please provide a valid Iranian phone number"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and profile management
 */

/**
 * @swagger
 * /api/v1/auth/authlogin:
 *   post:
 *     summary: Single authentication endpoint (Login/Register)
 *     description: |
 *       Multi-stage authentication:
 *       1. Send email only - returns status 'pending' for new users or 'login' for existing users
 *       2. For existing users, send email + password to login
 *       3. For new users, send email + firstName + lastName + password + rePassword to register
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRequest'
 *           examples:
 *             email_check:
 *               summary: Initial email check
 *               value:
 *                 email: "user@example.com"
 *             existing_user_login:
 *               summary: Existing user login
 *               value:
 *                 email: "user@example.com"
 *                 password: "password123"
 *             new_user_register:
 *               summary: New user registration
 *               value:
 *                 email: "newuser@example.com"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 password: "password123"
 *                 rePassword: "password123"
 *     responses:
 *       200:
 *         description: Login successful or email check completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               login_required:
 *                 summary: Password required for login
 *                 value:
 *                   success: true
 *                   message: "Please enter your password to continue"
 *                   data:
 *                     status: "login"
 *                     message: "Password required for login"
 *                     required_fields: ["password"]
 *               login_success:
 *                 summary: Successful login
 *                 value:
 *                   success: true
 *                   message: "Login successful"
 *                   data:
 *                     status: "login"
 *                     user:
 *                       id: "clx1234567890"
 *                       email: "user@example.com"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       role: "CUSTOMER"
 *                       isActive: true
 *                     tokens:
 *                       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       accessTokenExpiresIn: "15m"
 *                       refreshTokenExpiresIn: "7d"
 *               registration_required:
 *                 summary: Registration required
 *                 value:
 *                   success: true
 *                   message: "Please register to complete your account setup"
 *                   data:
 *                     status: "pending"
 *                     message: "Please provide your registration details"
 *                     required_fields: ["firstName", "lastName", "password", "rePassword"]
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               success: true
 *               message: "Registration completed successfully"
 *               data:
 *                 status: "register"
 *                 user:
 *                   id: "clx1234567890"
 *                   email: "newuser@example.com"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   role: "CUSTOMER"
 *                   isActive: true
 *                 tokens:
 *                   accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   accessTokenExpiresIn: "15m"
 *                   refreshTokenExpiresIn: "7d"
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   success: false
 *                   message: "Please provide a valid email address"
 *               password_mismatch:
 *                 summary: Password mismatch
 *                 value:
 *                   success: false
 *                   message: "Passwords do not match"
 *       401:
 *         description: Unauthorized - invalid password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Invalid password"
 *       403:
 *         description: Forbidden - account deactivated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Your account is deactivated"
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Too many authentication attempts, please try again later"
 *               retryAfter: 900
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout the current authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Logout successful"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh authentication tokens
 *     description: Generate new access and refresh tokens using current valid token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
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
 *                   example: "Token refreshed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokens:
 *                       $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve current authenticated user's profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                   example: "Profile retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update user profile
 *     description: Update current authenticated user's profile information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           example:
 *             firstName: "John"
 *             lastName: "Smith"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change user password
 *     description: Change the current authenticated user's password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *           example:
 *             currentPassword: "oldPassword123"
 *             newPassword: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               success: true
 *               message: "Password changed successfully"
 *       400:
 *         description: Bad request - validation error or incorrect current password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               incorrect_password:
 *                 summary: Incorrect current password
 *                 value:
 *                   success: false
 *                   message: "Current password is incorrect"
 *               same_password:
 *                 summary: Same password error
 *                 value:
 *                   success: false
 *                   message: "New password must be different from current password"
 *               validation_error:
 *                 summary: Validation error
 *                 value:
 *                   success: false
 *                   message: "New password must be at least 6 characters long"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "User not found"
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Too many authentication attempts, please try again later"
 *               retryAfter: 900
 */

module.exports = {};
