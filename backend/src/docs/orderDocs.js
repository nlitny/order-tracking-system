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
 *           description: "Clear, descriptive title for the order"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: "Complete e-commerce website with payment integration, user authentication, and admin dashboard"
 *           description: "Detailed description of the order requirements"
 *         special_instructions:
 *           type: string
 *           example: "Please use modern design patterns and ensure mobile responsiveness"
 *           nullable: true
 *           description: "Additional instructions or special requirements"
 *         estimatedCompletion:
 *           type: string
 *           format: date-time
 *           example: "2025-10-15T12:00:00.000Z"
 *           nullable: true
 *           description: "Expected completion date (must be in the future)"
 *       required: ["title", "description"]
 *       additionalProperties: false
 *
 *     UpdateOrderRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *           example: "Updated Website Design Project"
 *           description: "Updated order title"
 *         description:
 *           type: string
 *           maxLength: 1000
 *           example: "Updated project description with new requirements"
 *           description: "Updated order description"
 *         special_instructions:
 *           type: string
 *           example: "Updated special instructions - focus on mobile-first design"
 *           nullable: true
 *           description: "Updated special instructions (set to null to clear)"
 *         estimatedCompletion:
 *           type: string
 *           format: date-time
 *           example: "2025-09-15T10:00:00.000Z"
 *           nullable: true
 *           description: "Updated estimated completion date (set to null to clear)"
 *       additionalProperties: false
 *       description: |
 *         **Customer Update Restrictions:**
 *         - Only the order owner (customer) can update their order
 *         - Updates are only allowed when order status is 'PENDING'
 *         - Status field is not updatable by customers
 *         - At least one field is required for partial update
 *         - All provided fields will be updated, others remain unchanged
 *
 *     OrderCustomer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clx1234567890"
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *
 *     OrderMediaFile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clm9876543210"
 *         fileName:
 *           type: string
 *           example: "project_screenshot_1234567890.jpg"
 *         originalName:
 *           type: string
 *           example: "final_design.jpg"
 *         mimeType:
 *           type: string
 *           example: "image/jpeg"
 *         size:
 *           type: integer
 *           example: 2048576
 *           description: "File size in bytes"
 *         fileType:
 *           type: string
 *           enum: [IMAGE, VIDEO, DOCUMENT, AUDIO, OTHER]
 *           example: "IMAGE"
 *         isPublic:
 *           type: boolean
 *           example: true
 *         description:
 *           type: string
 *           example: "Final design mockup for homepage"
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T14:30:00.000Z"
 *
 *     OrderHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clh9876543210"
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *           example: "IN_PROGRESS"
 *         comment:
 *           type: string
 *           example: "Order status updated to In Progress"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T10:15:00.000Z"
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *           example:
 *             action: "STATUS_UPDATED"
 *             previousStatus: "PENDING"
 *             updatedBy: "staff"
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
 *           description: "Unique order identifier"
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
 *           description: |
 *             Order Status Meanings:
 *             - PENDING: Order received, awaiting processing
 *             - IN_PROGRESS: Work has begun on the order
 *             - COMPLETED: Order has been completed
 *             - CANCELLED: Order has been cancelled
 *             - ON_HOLD: Order is temporarily on hold
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
 *           description: "Timestamp when order was completed"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T09:15:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T09:15:00.000Z"
 *         customer:
 *           $ref: '#/components/schemas/OrderCustomer'
 *         mediaFiles:
 *           type: array
 *           description: "⚠️ Only populated when status is 'COMPLETED', otherwise empty array"
 *           items:
 *             $ref: '#/components/schemas/OrderMediaFile'
 *         customermedia:
 *           type: array
 *           description: "Media files uploaded by the customer"
 *           items:
 *             $ref: '#/components/schemas/CustomerMediaFile'
 *         orderHistory:
 *           type: array
 *           description: "Order status change history (last 10 entries)"
 *           items:
 *             $ref: '#/components/schemas/OrderHistory'
 *
 *     OrdersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Orders retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             orders:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Order'
 *                   - type: object
 *                     properties:
 *                       mediaFiles:
 *                         description: "Not included in list view"
 *                         type: array
 *                         maxItems: 0
 *                       orderHistory:
 *                         description: "Not included in list view"
 *                         type: array
 *                         maxItems: 0
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalItems:
 *                   type: integer
 *                   example: 47
 *                 hasNext:
 *                   type: boolean
 *                   example: true
 *                 hasPrev:
 *                   type: boolean
 *                   example: false
 *                 limit:
 *                   type: integer
 *                   example: 10
 *
 * /api/v1/orders:
 *   get:
 *     summary: Get all orders with pagination and filtering
 *     description: |
 *       Retrieves a paginated list of orders with optional filtering capabilities.
 *       
 *       **Access Control:**
 *       - CUSTOMER users see only their own orders
 *       - ADMIN/STAFF users see all orders
 *       
 *       **Response Data:**
 *       - Orders in the list do NOT include mediaFiles or orderHistory for performance
 *       - Use the single order endpoint to get detailed information
 *       
 *       **Filtering Options:**
 *       - Search across title, description, and order number
 *       - Filter by order status
 *       - Pagination with configurable page size
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
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD]
 *         description: Filter orders by status
 *         example: "PENDING"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *         description: Search in title, description, or order number (case-insensitive)
 *         example: "website"
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 *             examples:
 *               success_with_orders:
 *                 summary: Successful response with orders
 *                 value:
 *                   success: true
 *                   message: "Orders retrieved successfully"
 *                   data:
 *                     orders:
 *                       - id: "clx9876543210"
 *                         orderNumber: "ORD-20250828-00001"
 *                         title: "Website Development"
 *                         status: "PENDING"
 *                         createdAt: "2025-08-28T09:15:00.000Z"
 *                         customer:
 *                           firstName: "John"
 *                           lastName: "Doe"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 3
 *                       totalItems: 25
 *                       hasNext: true
 *                       hasPrev: false
 *                       limit: 10
 *               empty_result:
 *                 summary: No orders found
 *                 value:
 *                   success: true
 *                   message: "Orders retrieved successfully"
 *                   data:
 *                     orders: []
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 0
 *                       totalItems: 0
 *                       hasNext: false
 *                       hasPrev: false
 *                       limit: 10
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_status:
 *                 summary: Invalid status filter
 *                 value:
 *                   success: false
 *                   message: "Invalid status value"
 *                   error: "VALIDATION_ERROR"
 *               invalid_pagination:
 *                 summary: Invalid pagination parameters
 *                 value:
 *                   success: false
 *                   message: "Page must be a positive integer"
 *                   error: "VALIDATION_ERROR"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   post:
 *     summary: Create a new order
 *     description: |
 *       Creates a new order for the authenticated customer.
 *       
 *       **Order Creation Process:**
 *       1. Order is created with status 'PENDING'
 *       2. Unique order number is automatically generated (format: ORD-YYYYMMDD-XXXXX)
 *       3. Order history entry is created for tracking
 *       4. Customer can then upload media files using the customer media endpoints
 *       
 *       **Generated Fields:**
 *       - `orderNumber`: Auto-generated unique identifier
 *       - `customerId`: Set to authenticated user's ID
 *       - `status`: Always starts as 'PENDING'
 *       - `createdAt`, `updatedAt`: Current timestamp
 *       
 *       **Next Steps After Creation:**
 *       - Use the returned order ID to upload customer media files
 *       - Order will be visible in the customer's order list
 *       - Staff can view and process the order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           examples:
 *             basic_order:
 *               summary: Basic order creation
 *               value:
 *                 title: "Website Development Project"
 *                 description: "Complete e-commerce website with payment integration"
 *             detailed_order:
 *               summary: Order with all optional fields
 *               value:
 *                 title: "Custom Mobile Application"
 *                 description: "iOS and Android app with backend API integration"
 *                 special_instructions: "Please ensure GDPR compliance and use modern UI/UX patterns"
 *                 estimatedCompletion: "2025-12-15T18:00:00.000Z"
 *             minimal_order:
 *               summary: Minimal required fields only
 *               value:
 *                 title: "Logo Design"
 *                 description: "Modern logo design for tech startup"
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: "Order created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *             examples:
 *               created_order:
 *                 summary: Successfully created order
 *                 value:
 *                   success: true
 *                   message: "Order created successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     orderNumber: "ORD-20250828-00001"
 *                     customerId: "clx1234567890"
 *                     title: "Website Development Project"
 *                     description: "Complete e-commerce website"
 *                     status: "PENDING"
 *                     estimatedCompletion: "2025-12-15T18:00:00.000Z"
 *                     special_instructions: "Modern design patterns"
 *                     completedAt: null
 *                     createdAt: "2025-08-28T09:15:00.000Z"
 *                     updatedAt: "2025-08-28T09:15:00.000Z"
 *                     customer:
 *                       id: "clx1234567890"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "john.doe@example.com"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_title:
 *                 summary: Missing required title
 *                 value:
 *                   success: false
 *                   message: "Order title is required"
 *                   error: "VALIDATION_ERROR"
 *                   details:
 *                     field: "title"
 *                     code: "REQUIRED"
 *               invalid_date:
 *                 summary: Invalid estimated completion date
 *                 value:
 *                   success: false
 *                   message: "Estimated completion date cannot be in the past"
 *                   error: "VALIDATION_ERROR"
 *                   details:
 *                     field: "estimatedCompletion"
 *                     code: "DATE_PAST"
 *               title_too_short:
 *                 summary: Title too short
 *                 value:
 *                   success: false
 *                   message: "Order title must be at least 3 characters long"
 *                   error: "VALIDATION_ERROR"
 *                   details:
 *                     field: "title"
 *                     code: "MIN_LENGTH"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order by ID with conditional media files
 *     description: |
 *       Retrieves detailed information about a specific order including customer details, order history, customer media, and conditionally staff media files.
 *       
 *       **Media Files Access Rule:**
 *       - Staff media files (mediaFiles) are ONLY included when order status is 'COMPLETED'
 *       - Customer media files (customermedia) are always included
 *       - For orders with other statuses (PENDING, IN_PROGRESS, CANCELLED, ON_HOLD), mediaFiles will be an empty array
 *       
 *       **Access Control:**
 *       - CUSTOMER users can only access their own orders
 *       - ADMIN/STAFF users can access all orders
 *       
 *       **Included Data:**
 *       - Complete order information
 *       - Customer details (limited fields for privacy)
 *       - Order history (last 10 entries, newest first)
 *       - Customer uploaded media files (always visible to order owner)
 *       - Staff uploaded media files (only when COMPLETED)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order unique identifier
 *         example: "clx9876543210"
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
 *                   $ref: '#/components/schemas/Order'
 *             examples:
 *               completed_order:
 *                 summary: Completed order with all media files
 *                 value:
 *                   success: true
 *                   message: "Order retrieved successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     orderNumber: "ORD-20250828-00001"
 *                     status: "COMPLETED"
 *                     title: "Website Development Project"
 *                     completedAt: "2025-09-10T14:30:00.000Z"
 *                     mediaFiles:
 *                       - id: "clm1111111111"
 *                         fileName: "final_website_screenshot.jpg"
 *                         originalName: "website_final.jpg"
 *                         fileType: "IMAGE"
 *                         description: "Final website screenshot"
 *                     customermedia:
 *                       - id: "clc2222222222"
 *                         fileName: "requirements_document.pdf"
 *                         originalName: "project_requirements.pdf"
 *                         fileType: "DOCUMENT"
 *               pending_order:
 *                 summary: Pending order (no staff media files)
 *                 value:
 *                   success: true
 *                   message: "Order retrieved successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     status: "PENDING"
 *                     mediaFiles: []
 *                     customermedia:
 *                       - id: "clc2222222222"
 *                         fileName: "requirements_document.pdf"
 *                         fileType: "DOCUMENT"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               order_not_found:
 *                 summary: Order with given ID doesn't exist
 *                 value:
 *                   success: false
 *                   message: "Order not found"
 *                   error: "NOT_FOUND"
 *       403:
 *         description: Access denied (customer trying to access another customer's order)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               access_denied:
 *                 summary: Customer accessing another customer's order
 *                 value:
 *                   success: false
 *                   message: "Access denied. You can only view your own orders"
 *                   error: "FORBIDDEN"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   patch:
 *     summary: Update order by ID (Customer Only - PENDING Status)
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
 *       - Set fields to null to clear optional values
 *       
 *       **Order History:**
 *       - All updates are logged in order history
 *       - Metadata includes which fields were changed
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order unique identifier
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
 *                 title: "Updated Website Development Project"
 *             update_multiple_fields:
 *               summary: Update multiple fields
 *               value:
 *                 title: "Enhanced E-commerce Platform"
 *                 description: "Updated requirements with additional features like inventory management"
 *                 special_instructions: "Focus on mobile-first design approach"
 *                 estimatedCompletion: "2025-09-20T10:00:00.000Z"
 *             clear_optional_fields:
 *               summary: Clear optional fields
 *               value:
 *                 special_instructions: null
 *                 estimatedCompletion: null
 *             update_description:
 *               summary: Update description and instructions
 *               value:
 *                 description: "Comprehensive e-commerce solution with advanced analytics dashboard"
 *                 special_instructions: "Include A/B testing capabilities for product pages"
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
 *             examples:
 *               successful_update:
 *                 summary: Order successfully updated
 *                 value:
 *                   success: true
 *                   message: "Order updated successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     orderNumber: "ORD-20250828-00001"
 *                     title: "Updated Website Development Project"
 *                     description: "Enhanced project requirements"
 *                     status: "PENDING"
 *                     updatedAt: "2025-08-28T15:30:00.000Z"
 *                     customer:
 *                       firstName: "John"
 *                       lastName: "Doe"
 *       400:
 *         description: Bad request - validation error or business rule violation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_fields_provided:
 *                 summary: No fields provided for update
 *                 value:
 *                   success: false
 *                   message: "At least one field is required to update"
 *                   error: "VALIDATION_ERROR"
 *               order_not_pending:
 *                 summary: Order status not PENDING
 *                 value:
 *                   success: false
 *                   message: "Order can only be updated when status is PENDING"
 *                   error: "BUSINESS_RULE_ERROR"
 *                   details:
 *                     currentStatus: "IN_PROGRESS"
 *                     allowedStatuses: ["PENDING"]
 *               validation_error:
 *                 summary: Field validation error
 *                 value:
 *                   success: false
 *                   message: "Order title must be at least 3 characters long"
 *                   error: "VALIDATION_ERROR"
 *                   details:
 *                     field: "title"
 *                     code: "MIN_LENGTH"
 *               past_date:
 *                 summary: Invalid estimated completion date
 *                 value:
 *                   success: false
 *                   message: "Estimated completion date cannot be in the past"
 *                   error: "VALIDATION_ERROR"
 *                   details:
 *                     field: "estimatedCompletion"
 *                     code: "DATE_PAST"
 *       403:
 *         description: Access denied - not order owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_owner:
 *                 summary: Customer trying to update another customer's order
 *                 value:
 *                   success: false
 *                   message: "Access denied. You can only update your own orders"
 *                   error: "FORBIDDEN"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               order_not_found:
 *                 summary: Order with given ID doesn't exist
 *                 value:
 *                   success: false
 *                   message: "Order not found"
 *                   error: "NOT_FOUND"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
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
 *       
 *       **⚠️ Important Notes:**
 *       - Cancellation is immediate and irreversible for customers
 *       - Staff may still be able to reactivate cancelled orders
 *       - All uploaded media files remain accessible
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order unique identifier to cancel
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
 *                   allOf:
 *                     - $ref: '#/components/schemas/Order'
 *                     - type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "CANCELLED"
 *                           description: "Status is now CANCELLED"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-08-28T10:30:00.000Z"
 *                           description: "Updated with cancellation time"
 *                         orderHistory:
 *                           type: array
 *                           description: "Includes the new cancellation entry at the top"
 *                           items:
 *                             $ref: '#/components/schemas/OrderHistory'
 *             examples:
 *               cancelled_from_pending:
 *                 summary: Order cancelled from PENDING status
 *                 value:
 *                   success: true
 *                   message: "Order cancelled successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     orderNumber: "ORD-20250828-00001"
 *                     customerId: "clx1234567890"
 *                     title: "Website Development Project"
 *                     status: "CANCELLED"
 *                     createdAt: "2025-08-28T09:15:00.000Z"
 *                     updatedAt: "2025-08-28T10:30:00.000Z"
 *                     customer:
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                     orderHistory:
 *                       - id: "clh9999999999"
 *                         status: "CANCELLED"
 *                         comment: "Order cancelled by customer"
 *                         createdAt: "2025-08-28T10:30:00.000Z"
 *                         metadata:
 *                           action: "ORDER_CANCELLED"
 *                           cancelledBy: "customer"
 *                           previousStatus: "PENDING"
 *                           cancelledAt: "2025-08-28T10:30:00.000Z"
 *               cancelled_from_in_progress:
 *                 summary: Order cancelled from IN_PROGRESS status
 *                 value:
 *                   success: true
 *                   message: "Order cancelled successfully"
 *                   data:
 *                     id: "clx9876543210"
 *                     status: "CANCELLED"
 *                     updatedAt: "2025-08-28T15:45:00.000Z"
 *                     orderHistory:
 *                       - status: "CANCELLED"
 *                         comment: "Order cancelled by customer"
 *                         metadata:
 *                           action: "ORDER_CANCELLED"
 *                           previousStatus: "IN_PROGRESS"
 *                           cancelledBy: "customer"
 *       400:
 *         description: Order cannot be cancelled due to current status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               completed_order:
 *                 summary: Trying to cancel completed order
 *                 value:
 *                   success: false
 *                   message: "Order cannot be cancelled. Current status: COMPLETED. Only PENDING or IN_PROGRESS orders can be cancelled"
 *                   error: "BUSINESS_RULE_ERROR"
 *                   details:
 *                     currentStatus: "COMPLETED"
 *                     allowedStatuses: ["PENDING", "IN_PROGRESS"]
 *               already_cancelled:
 *                 summary: Trying to cancel already cancelled order
 *                 value:
 *                   success: false
 *                   message: "Order cannot be cancelled. Current status: CANCELLED. Only PENDING or IN_PROGRESS orders can be cancelled"
 *                   error: "BUSINESS_RULE_ERROR"
 *                   details:
 *                     currentStatus: "CANCELLED"
 *                     allowedStatuses: ["PENDING", "IN_PROGRESS"]
 *               on_hold_order:
 *                 summary: Trying to cancel order on hold
 *                 value:
 *                   success: false
 *                   message: "Order cannot be cancelled. Current status: ON_HOLD. Only PENDING or IN_PROGRESS orders can be cancelled"
 *                   error: "BUSINESS_RULE_ERROR"
 *                   details:
 *                     currentStatus: "ON_HOLD"
 *                     allowedStatuses: ["PENDING", "IN_PROGRESS"]
 *                     note: "Orders on hold require staff intervention"
 *       403:
 *         description: Access denied - not order owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_owner:
 *                 summary: Customer trying to cancel another customer's order
 *                 value:
 *                   success: false
 *                   message: "Access denied. You can only cancel your own orders"
 *                   error: "FORBIDDEN"
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               order_not_found:
 *                 summary: Order with given ID doesn't exist
 *                 value:
 *                   success: false
 *                   message: "Order not found"
 *                   error: "NOT_FOUND"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
