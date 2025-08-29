
/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRoleRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           example: "clx1234567890"
 *         role:
 *           type: string
 *           enum: [CUSTOMER, STAFF, ADMIN]
 *           example: "STAFF"
 *       required: ["userId", "role"]
 *       additionalProperties: false
 *
 * /api/v1/users/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     description: Allows ADMIN to update a user's role.
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
 *         description: User role updated successfully
 *       400:
 *         description: Invalid role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only ADMIN allowed)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
