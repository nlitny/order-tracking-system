/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrderRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *           example: "Website Development Project"
 *         description:
 *           type: string
 *           example: "Complete e-commerce website with payment integration"
 *         special_instructions:
 *           type: string
 *           example: "Please use modern design patterns"
 *           nullable: true
 *         estimatedCompletion:
 *           type: string
 *           format: date-time
 *           example: "2025-10-15T12:00:00.000Z"
 *           nullable: true
 *       required: ["title", "description"]
 *
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *           example: "Updated Website Design Project"
 *         description:
 *           type: string
 *           example: "Updated project description"
 *         special_instructions:
 *           type: string
 *           example: "Updated special instructions"
 *           nullable: true
 *         estimatedCompletion:
 *           type: string
 *           format: date-time
 *           example: "2025-09-15T10:00:00.000Z"
 *           nullable: true
 *       description: |
 *         **Customer Update Restrictions:**
 *         - Only the order owner (customer) can update their order
 *         - Updates are only allowed when order status is 'PENDING'
 *         - Status field is not updatable by customers
 *         - At least one field is required for partial update
 *         - All provided fields will be updated, others remain unchanged
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clx9876543210"
 *         orderNumber:
 *           type: string
 *           example: "ORD-20250828-00001"
 *         customerId:
 *           type: string
 *           example: "clx1234567890"
 *         title:
 *           type: string
 *           example: "Website Development Project"
 *         description:
 *           type: string
 *           example: "Complete e-commerce website with payment integration"
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *           example: "PENDING"
 *         estimatedCompletion:
 *           type: string
 *           format: date-time
 *           example: "2025-09-15T10:00:00.000Z"
 *           nullable: true
 *         special_instructions:
 *           type: string
 *           example: "Please use modern design patterns"
 *           nullable: true
 *         completedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-10T14:30:00.000Z"
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T09:15:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T09:15:00.000Z"
 *         customer:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "clx1234567890"
 *             firstName:
 *               type: string
 *               example: "John"
 *             lastName:
 *               type: string
 *               example: "Doe"
 *             email:
 *               type: string
 *               format: email
 *               example: "john.doe@example.com"
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders with pagination and filtering
 *     tags: [Orders]
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
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, or order number
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 *
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID with conditional media files
 *     description: |
 *       Retrieves detailed information about a specific order including customer details, order history, and conditionally media files.
 *       
 *       **Media Files Access Rule:**
 *       - Media files are ONLY included when order status is 'COMPLETED'
 *       - For orders with other statuses (PENDING, IN_PROGRESS, CANCELLED, ON_HOLD), mediaFiles will be an empty array
 *       
 *       **Access Control:**
 *       - CUSTOMER users can only access their own orders
 *       - ADMIN/STAFF users can access all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
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
 *                   example: "Order retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx9876543210"
 *                     orderNumber:
 *                       type: string
 *                       example: "ORD-20250828-00001"
 *                     customerId:
 *                       type: string
 *                       example: "clx1234567890"
 *                     title:
 *                       type: string
 *                       example: "Website Development Project"
 *                     description:
 *                       type: string
 *                       example: "Complete e-commerce website"
 *                     status:
 *                       type: string
 *                       enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *                       example: "COMPLETED"
 *                     estimatedCompletion:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     special_instructions:
 *                       type: string
 *                       nullable: true
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         firstName:
 *                           type: string
 *                         lastName:
 *                           type: string
 *                         email:
 *                           type: string
 *                           format: email
 *                     mediaFiles:
 *                       type: array
 *                       description: "⚠️ Only populated when status is 'COMPLETED', otherwise empty array"
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           fileName:
 *                             type: string
 *                           originalName:
 *                             type: string
 *                           mimeType:
 *                             type: string
 *                           size:
 *                             type: integer
 *                           fileType:
 *                             type: string
 *                             enum: [DOCUMENT, IMAGE, VIDEO, AUDIO, OTHER]
 *                           isPublic:
 *                             type: boolean
 *                           description:
 *                             type: string
 *                             nullable: true
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     orderHistory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           status:
 *                             type: string
 *                           comment:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           metadata:
 *                             type: object
 *       404:
 *         description: Order not found
 *       403:
 *         description: Access denied (customer trying to access another customer's order)
 *
 *   patch:
 *     summary: Partially update order by ID (Customer Only - PENDING Status)
 *     description: |
 *       Allows customers to partially update their own orders with strict restrictions.
 *       
 *       **🚫 Access Restrictions:**
 *       - Only the order OWNER (customer who created it) can update
 *       - Updates are ONLY allowed when order status is 'PENDING'
 *       - Once status changes to IN_PROGRESS, COMPLETED, etc., no updates allowed
 *       
 *       **📝 Updatable Fields (PENDING only):**
 *       - `title`: Order title
 *       - `description`: Order description  
 *       - `special_instructions`: Special instructions
 *       - `estimatedCompletion`: Estimated completion date
 *       
 *       **⚠️ Not Updatable by Customer:**
 *       - `status`: Only admin/staff can change order status
 *       - `orderNumber`, `customerId`, `completedAt`: System managed
 *       
 *       **Partial Update Behavior:**
 *       - Only provided fields will be updated
 *       - Other fields remain unchanged
 *       - At least one field must be provided
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "clx9876543210"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderRequest'
 *           examples:
 *             update_title_only:
 *               summary: Update only title
 *               value:
 *                 title: "New Project Title"
 *             update_multiple_fields:
 *               summary: Update multiple fields
 *               value:
 *                 title: "Updated Website Project"
 *                 description: "Updated description with new requirements"
 *                 special_instructions: "Please focus on mobile-first design"
 *                 estimatedCompletion: "2025-09-20T10:00:00.000Z"
 *             clear_optional_field:
 *               summary: Clear optional field
 *               value:
 *                 special_instructions: null
 *                 estimatedCompletion: null
 *     responses:
 *       200:
 *         description: Order updated successfully
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
 *                   example: "Order updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   enum:
 *                     - "At least one field is required to update"
 *                     - "Order can only be updated when status is PENDING"
 *                     - "Validation error"
 *                   example: "Order can only be updated when status is PENDING"
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access denied. You can only update your own orders"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel order by ID (Customer Only - PENDING/IN_PROGRESS)
 *     description: |
 *       Allows customers to cancel their own orders with specific status and ownership restrictions.
 *       
 *       **🚫 Access Restrictions:**
 *       - Only the order OWNER (customer who created it) can cancel
 *       - Cancellation is ONLY allowed when order status is 'PENDING' or 'IN_PROGRESS'
 *       - Orders with status 'COMPLETED', 'CANCELLED', or 'ON_HOLD' cannot be cancelled
 *       
 *       **📋 Cancellation Process:**
 *       - Order status is immediately updated to 'CANCELLED'
 *       - A record is added to order history with cancellation details
 *       - The previous status and cancellation timestamp are logged in metadata
 *       - Once cancelled, the order cannot be reactivated by customers
 *       
 *       **🔒 Status Rules:**
 *       - ✅ **PENDING**: Can be cancelled (order not started yet)
 *       - ✅ **IN_PROGRESS**: Can be cancelled (work in progress)
 *       - ❌ **COMPLETED**: Cannot be cancelled (work is done)
 *       - ❌ **CANCELLED**: Cannot be cancelled (already cancelled)
 *       - ❌ **ON_HOLD**: Cannot be cancelled (requires admin intervention)
 *       
 *       **📝 Order History Logging:**
 *       - Action: ORDER_CANCELLED
 *       - Comment: "Order cancelled by customer"
 *       - Metadata includes previous status and cancellation timestamp
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to cancel
 *         example: "clx9876543210"
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                   example: "Order cancelled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx9876543210"
 *                     orderNumber:
 *                       type: string
 *                       example: "ORD-20250828-00001"
 *                     customerId:
 *                       type: string
 *                       example: "clx1234567890"
 *                     title:
 *                       type: string
 *                       example: "Website Development Project"
 *                     description:
 *                       type: string
 *                       example: "Complete e-commerce website"
 *                     status:
 *                       type: string
 *                       example: "CANCELLED"
 *                       description: "Status is now CANCELLED"
 *                     estimatedCompletion:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     special_instructions:
 *                       type: string
 *                       nullable: true
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-28T09:15:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-28T10:30:00.000Z"
 *                       description: "Updated with cancellation time"
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "clx1234567890"
 *                         firstName:
 *                           type: string
 *                           example: "John"
 *                         lastName:
 *                           type: string
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: "john.doe@example.com"
 *                     orderHistory:
 *                       type: array
 *                       description: "Includes the new cancellation entry at the top"
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           status:
 *                             type: string
 *                             example: "CANCELLED"
 *                           comment:
 *                             type: string
 *                             example: "Order cancelled by customer"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           metadata:
 *                             type: object
 *                             properties:
 *                               action:
 *                                 type: string
 *                                 example: "ORDER_CANCELLED"
 *                               cancelledBy:
 *                                 type: string
 *                                 example: "customer"
 *                               previousStatus:
 *                                 type: string
 *                                 example: "IN_PROGRESS"
 *                               cancelledAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2025-08-28T10:30:00.000Z"
 *             examples:
 *               cancelled_from_pending:
 *                 summary: Order cancelled from PENDING status
 *                 value:
 *                   success: true
 *                   message: "Order cancelled successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     orderNumber: "ORD-20250828-00001"
 *                     status: "CANCELLED"
 *                     title: "Website Development"
 *                     orderHistory:
 *                       - status: "CANCELLED"
 *                         comment: "Order cancelled by customer"
 *                         metadata:
 *                           action: "ORDER_CANCELLED"
 *                           previousStatus: "PENDING"
 *                           cancelledBy: "customer"
 *               cancelled_from_in_progress:
 *                 summary: Order cancelled from IN_PROGRESS status
 *                 value:
 *                   success: true
 *                   message: "Order cancelled successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     status: "CANCELLED"
 *                     orderHistory:
 *                       - status: "CANCELLED"
 *                         metadata:
 *                           previousStatus: "IN_PROGRESS"
 *       400:
 *         description: Order cannot be cancelled due to current status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Order cannot be cancelled. Current status: COMPLETED. Only PENDING or IN_PROGRESS orders can be cancelled"
 *             examples:
 *               completed_order:
 *                 summary: Trying to cancel completed order
 *                 value:
 *                   success: false
 *                   message: "Order cannot be cancelled. Current status: COMPLETED. Only PENDING or IN_PROGRESS orders can be cancelled"
 *               already_cancelled:
 *                 summary: Trying to cancel already cancelled order
 *                 value:
 *                   success: false
 *                   message: "Order cannot be cancelled. Current status: CANCELLED. Only PENDING or IN_PROGRESS orders can be cancelled"
 *               on_hold_order:
 *                 summary: Trying to cancel order on hold
 *                 value:
 *                   success: false
 *                   message: "Order cannot be cancelled. Current status: ON_HOLD. Only PENDING or IN_PROGRESS orders can be cancelled"
 *       403:
 *         description: Access denied - not order owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access denied. You can only cancel your own orders"
 *             examples:
 *               not_owner:
 *                 summary: Customer trying to cancel another customer's order
 *                 value:
 *                   success: false
 *                   message: "Access denied. You can only cancel your own orders"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *             examples:
 *               order_not_found:
 *                 summary: Order with given ID doesn't exist
 *                 value:
 *                   success: false
 *                   message: "Order not found"
 */
