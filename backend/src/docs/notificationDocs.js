
/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Notification management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cln9876543210"
 *         userId:
 *           type: string
 *           example: "clx1234567890"
 *         orderId:
 *           type: string
 *           example: "clx9876543210"
 *           nullable: true
 *         type:
 *           type: string
 *           enum: [ORDER_UPDATE, ORDER_COMPLETED, SYSTEM_ALERT, REMINDER]
 *           example: "ORDER_UPDATE"
 *         title:
 *           type: string
 *           example: "Order Approved"
 *         message:
 *           type: string
 *           example: "Your order has been approved and is currently in progress."
 *         isRead:
 *           type: boolean
 *           example: false
 *         sentAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-29T10:15:00.000Z"
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-29T10:15:00.000Z"
 *         order:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *               example: "clx9876543210"
 *             orderNumber:
 *               type: string
 *               example: "ORD-20250829-00001"
 *             title:
 *               type: string
 *               example: "Website Development Project"
 *             status:
 *               type: string
 *               enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *               example: "IN_PROGRESS"
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get all notifications for authenticated user
 *     description: |
 *       Retrieves a paginated list of notifications for the authenticated user.
 *       
 *       **Access Control:**
 *       - Users can only see their own notifications
 *       - Works for all user roles (CUSTOMER, STAFF, ADMIN)
 *       
 *       **Response Data:**
 *       - Notifications are ordered by creation date (newest first)
 *       - Includes associated order information when available
 *       - Shows read/unread status
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Number of notifications per page
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
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
 *                   example: "Notifications retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Notification'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                         totalItems:
 *                           type: integer
 *                           example: 45
 *                         hasNextPage:
 *                           type: boolean
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           example: false
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: |
 *       Marks a specific notification as read for the authenticated user.
 *       
 *       **Access Control:**
 *       - Users can only mark their own notifications as read
 *       - Attempting to mark another user's notification will result in 404
 *       
 *       **Behavior:**
 *       - Changes `isRead` status from false to true
 *       - If notification is already read, the operation is still successful
 *       - Returns the updated notification object
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notification unique identifier
 *         example: "cln9876543210"
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
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
 *                   example: "Notification marked as read"
 *                 data:
 *                   type: object
 *                   properties:
 *                     notification:
 *                       allOf:
 *                         - $ref: '#/components/schemas/Notification'
 *                         - type: object
 *                           properties:
 *                             isRead:
 *                               type: boolean
 *                               example: true
 *       404:
 *         description: Notification not found or access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_found:
 *                 summary: Notification not found
 *                 value:
 *                   success: false
 *                   message: "Notification not found or access denied"
 *                   error: "NOT_FOUND"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     description: |
 *       Returns the count of unread notifications for the authenticated user.
 *       
 *       **Use Cases:**
 *       - Badge notifications in UI
 *       - Dashboard counters
 *       - Mobile app notification badges
 *       
 *       **Performance:**
 *       - Lightweight endpoint that only returns a count
 *       - Suitable for frequent polling
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
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
 *                   example: "Unread count retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     unreadCount:
 *                       type: integer
 *                       example: 3
 *                       description: "Number of unread notifications"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
