
/**
 * @swagger
 * components:
 *   schemas:
 *     CustomerMediaFile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clcm123456789"
 *           description: "Unique identifier for the media file"
 *         fileName:
 *           type: string
 *           example: "customer_upload_1693234567890.jpg"
 *           description: "Cloudinary filename (system generated)"
 *         originalName:
 *           type: string
 *           example: "project_mockup.jpg"
 *           description: "Original filename when uploaded"
 *         mimeType:
 *           type: string
 *           example: "image/jpeg"
 *           description: "MIME type of the file"
 *         size:
 *           type: integer
 *           example: 2048576
 *           description: "File size in bytes"
 *         fileType:
 *           type: string
 *           enum: [IMAGE, VIDEO, DOCUMENT, AUDIO, OTHER]
 *           example: "IMAGE"
 *           description: "Categorized file type"
 *         path:
 *           type: string
 *           example: "https://res.cloudinary.com/yourcloud/image/upload/v1693234567890/order-media/customer_upload_1693234567890.jpg"
 *           description: "Full Cloudinary URL for file access"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-28T14:30:00.000Z"
 *           description: "Upload timestamp"
 *
 *     CustomerMediaUploadResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *           example: "Media files uploaded successfully"
 *         data:
 *           type: object
 *           properties:
 *             uploadedFiles:
 *               type: integer
 *               example: 3
 *               description: "Number of files successfully uploaded"
 *             mediaFiles:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerMediaFile'
 *               description: "Details of all uploaded files"
 *
 *     CustomerMediaListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: object
 *           properties:
 *             mediaFiles:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CustomerMediaFile'
 *             count:
 *               type: integer
 *               example: 5
 *               description: "Total number of media files for this order"
 *
 *     FileUploadConstraints:
 *       type: object
 *       description: "File upload constraints and limitations"
 *       properties:
 *         maxFileSize:
 *           type: string
 *           example: "5MB per file"
 *           description: "Maximum individual file size"
 *         maxTotalSize:
 *           type: string
 *           example: "10MB total"
 *           description: "Maximum total size for all files in single upload"
 *         maxFiles:
 *           type: integer
 *           example: 10
 *           description: "Maximum number of files per upload"
 *         allowedFormats:
 *           type: array
 *           items:
 *             type: string
 *           example: ["jpg", "jpeg", "png", "gif", "mp4", "pdf", "mov", "avi"]
 *           description: "Supported file formats"
 *         allowedMimeTypes:
 *           type: array
 *           items:
 *             type: string
 *           example: ["image/jpeg", "image/png", "image/gif", "video/mp4", "application/pdf"]
 *           description: "Allowed MIME types"
 *
 * /api/v1/orders/{id}/customermedia:
 *   post:
 *     summary: Upload customer media files for an order
 *     description: |
 *       Allows customers to upload media files (images, videos, documents) for their own orders.
 *       
 *       **🔒 Access Restrictions:**
 *       - Only the order OWNER (customer who created it) can upload media
 *       - Media can only be uploaded for orders with status 'PENDING' or 'IN_PROGRESS'
 *       - Orders with status 'COMPLETED', 'CANCELLED', or 'ON_HOLD' do not accept new media
 *       
 *       **📁 File Constraints:**
 *       - Maximum 10 files per upload request
 *       - Individual file size: 5MB maximum
 *       - Total upload size: 10MB maximum per request
 *       - Supported formats: JPG, PNG, GIF, MP4, PDF, MOV, AVI
 *       
 *       **☁️ Storage:**
 *       - Files are stored securely in Cloudinary
 *       - Automatic file type detection and categorization
 *       - Unique filenames generated to prevent conflicts
 *       - Original filenames preserved for user reference
 *       
 *       **📝 Process:**
 *       1. Files are uploaded to Cloudinary
 *       2. File metadata is saved to database
 *       3. Order history is updated with upload activity
 *       4. If any error occurs, uploaded files are cleaned up
 *       
 *       **🎯 Use Cases:**
 *       - Upload project requirements documents
 *       - Share reference images or mockups
 *       - Provide video examples or tutorials
 *       - Submit additional context materials
 *     tags: [Customer Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID to upload media for
 *         example: "clx9876543210"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 minItems: 1
 *                 maxItems: 10
 *                 description: "Media files to upload (1-10 files)"
 *             required: ["files"]
 *           encoding:
 *             files:
 *               contentType: "image/jpeg, image/png, image/gif, video/mp4, application/pdf, video/mov, video/avi"
 *     responses:
 *       201:
 *         description: Media files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerMediaUploadResponse'
 *             examples:
 *               single_image:
 *                 summary: Single image uploaded
 *                 value:
 *                   status: "success"
 *                   message: "Media files uploaded successfully"
 *                   data:
 *                     uploadedFiles: 1
 *                     mediaFiles:
 *                       - id: "clcm123456789"
 *                         fileName: "customer_upload_1693234567890.jpg"
 *                         originalName: "website_mockup.jpg"
 *                         mimeType: "image/jpeg"
 *                         size: 1048576
 *                         fileType: "IMAGE"
 *                         path: "https://res.cloudinary.com/yourcloud/image/upload/v1693234567890/order-media/customer_upload_1693234567890.jpg"
 *                         createdAt: "2025-08-28T14:30:00.000Z"
 *               multiple_files:
 *                 summary: Multiple files uploaded
 *                 value:
 *                   status: "success"
 *                   message: "Media files uploaded successfully"
 *                   data:
 *                     uploadedFiles: 3
 *                     mediaFiles:
 *                       - id: "clcm123456789"
 *                         fileName: "customer_upload_1693234567890.jpg"
 *                         originalName: "homepage_design.jpg"
 *                         fileType: "IMAGE"
 *                         size: 2048576
 *                       - id: "clcm123456790"
 *                         fileName: "customer_upload_1693234567891.pdf"
 *                         originalName: "requirements.pdf"
 *                         fileType: "DOCUMENT"
 *                         size: 1024000
 *                       - id: "clcm123456791"
 *                         fileName: "customer_upload_1693234567892.mp4"
 *                         originalName: "demo_video.mp4"
 *                         fileType: "VIDEO"
 *                         size: 5242880
 *       400:
 *         description: Bad request - validation or constraint violations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               no_files:
 *                 summary: No files provided
 *                 value:
 *                   success: false
 *                   message: "No files uploaded"
 *                   error: "VALIDATION_ERROR"
 *               size_exceeded:
 *                 summary: Total file size exceeds limit
 *                 value:
 *                   success: false
 *                   message: "Total file size exceeds 10MB limit"
 *                   error: "FILE_SIZE_ERROR"
 *                   details:
 *                     totalSize: "12MB"
 *                     maxSize: "10MB"
 *               invalid_status:
 *                 summary: Order status doesn't allow media upload
 *                 value:
 *                   success: false
 *                   message: "Media can only be uploaded for PENDING or IN_PROGRESS orders"
 *                   error: "BUSINESS_RULE_ERROR"
 *                   details:
 *                     currentStatus: "COMPLETED"
 *                     allowedStatuses: ["PENDING", "IN_PROGRESS"]
 *               file_type_error:
 *                 summary: Unsupported file type
 *                 value:
 *                   success: false
 *                   message: "File type text/plain not allowed"
 *                   error: "FILE_TYPE_ERROR"
 *                   details:
 *                     allowedTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4", "application/pdf"]
 *               too_many_files:
 *                 summary: Too many files in single upload
 *                 value:
 *                   success: false
 *                   message: "Maximum 10 files allowed per upload"
 *                   error: "VALIDATION_ERROR"
 *                   details:
 *                     fileCount: 15
 *                     maxFiles: 10
 *       403:
 *         description: Access denied - not order owner or insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_owner:
 *                 summary: Customer trying to upload to another customer's order
 *                 value:
 *                   success: false
 *                   message: "Access denied. You can only upload media for your own orders"
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
 *       413:
 *         description: Payload too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               file_too_large:
 *                 summary: Individual file exceeds size limit
 *                 value:
 *                   success: false
 *                   message: "File size exceeds 5MB limit"
 *                   error: "FILE_SIZE_ERROR"
 *       415:
 *         description: Unsupported media type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 *   get:
 *     summary: Get customer media files for an order
 *     description: |
 *       Retrieves all media files uploaded by the customer for a specific order.
 *       
 *       **🔒 Access Control:**
 *       - Only the order OWNER (customer who created it) can view their media files
 *       - ADMIN/STAFF users can view all customer media files
 *       
 *       **📋 Response Data:**
 *       - Complete list of all customer-uploaded media files for the order
 *       - Files are ordered by upload date (newest first)
 *       - Includes file metadata, sizes, types, and Cloudinary URLs
 *       - Empty array if no media files have been uploaded
 *       
 *       **🔗 File Access:**
 *       - All files include direct Cloudinary URLs for immediate access
 *       - URLs are public but obscured (security through obscurity)
 *       - Files remain accessible even if order status changes
 *       
 *       **📊 Use Cases:**
 *       - Customer reviewing their uploaded files
 *       - Staff accessing customer-provided materials
 *       - Verification of file uploads before processing
 *       - Download of previously uploaded content
 *     tags: [Customer Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID to retrieve media files for
 *         example: "clx9876543210"
 *     responses:
 *       200:
 *         description: Customer media files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomerMediaListResponse'
 *             examples:
 *               with_media_files:
 *                 summary: Order with customer media files
 *                 value:
 *                   status: "success"
 *                   data:
 *                     mediaFiles:
 *                       - id: "clcm123456789"
 *                         fileName: "customer_upload_1693234567890.jpg"
 *                         originalName: "website_mockup.jpg"
 *                         mimeType: "image/jpeg"
 *                         size: 2048576
 *                         fileType: "IMAGE"
 *                         path: "https://res.cloudinary.com/yourcloud/image/upload/v1693234567890/order-media/customer_upload_1693234567890.jpg"
 *                         createdAt: "2025-08-28T14:30:00.000Z"
 *                       - id: "clcm123456790"
 *                         fileName: "customer_upload_1693234567891.pdf"
 *                         originalName: "project_requirements.pdf"
 *                         mimeType: "application/pdf"
 *                         size: 1024000
 *                         fileType: "DOCUMENT"
 *                         path: "https://res.cloudinary.com/yourcloud/raw/upload/v1693234567891/order-media/customer_upload_1693234567891.pdf"
 *                         createdAt: "2025-08-28T14:25:00.000Z"
 *                       - id: "clcm123456791"
 *                         fileName: "customer_upload_1693234567892.mp4"
 *                         originalName: "reference_video.mp4"
 *                         mimeType: "video/mp4"
 *                         size: 5242880
 *                         fileType: "VIDEO"
 *                         path: "https://res.cloudinary.com/yourcloud/video/upload/v1693234567892/order-media/customer_upload_1693234567892.mp4"
 *                         createdAt: "2025-08-28T14:20:00.000Z"
 *                     count: 3
 *               no_media_files:
 *                 summary: Order with no customer media files
 *                 value:
 *                   status: "success"
 *                   data:
 *                     mediaFiles: []
 *                     count: 0
 *       403:
 *         description: Access denied - not order owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_owner:
 *                 summary: Customer trying to access another customer's media
 *                 value:
 *                   success: false
 *                   message: "Access denied"
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
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *
 * /api/v1/orders/customermedia/{mediaId}:
 *   delete:
 *     summary: Delete customer media file
 *     description: |
 *       Allows customers to delete specific media files they have uploaded.
 *       
 *       **🔒 Access Restrictions:**
 *       - Only the customer who uploaded the file can delete it
 *       - File can only be deleted if the associated order status is 'PENDING'
 *       - Once order moves to 'IN_PROGRESS' or beyond, media files become locked
 *       
 *       **🗑️ Deletion Process:**
 *       1. Verify file ownership and order permissions
 *       2. Check order status allows deletion (PENDING only)
 *       3. Remove file from Cloudinary storage
 *       4. Delete file record from database
 *       5. Log deletion activity in order history
 *       
 *       **⚠️ Important Notes:**
 *       - Deletion is permanent and irreversible
 *       - File will be immediately removed from Cloudinary
 *       - File URL will become invalid after deletion
 *       - Order history will record the deletion activity
 *       
 *       **🔒 Status Rules:**
 *       - ✅ **PENDING**: Files can be deleted (order not started)
 *       - ❌ **IN_PROGRESS**: Files locked (work in progress)
 *       - ❌ **COMPLETED**: Files locked (work complete)
 *       - ❌ **CANCELLED**: Files preserved (for reference)
 *       - ❌ **ON_HOLD**: Files locked (requires admin action)
 *       
 *       **📝 Use Cases:**
 *       - Remove incorrect or outdated files
 *       - Replace files with updated versions
 *       - Clean up before order processing begins
 *       - Correct mistakes in file uploads
 *     tags: [Customer Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media file ID to delete
 *         example: "clcm123456789"
 *     responses:
 *       200:
 *         description: Media file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Media file deleted successfully"
 *             examples:
 *               successful_deletion:
 *                 summary: File successfully deleted
 *                 value:
 *                   status: "success"
 *                   message: "Media file deleted successfully"
 *       400:
 *         description: Bad request - cannot delete due to order status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               order_not_pending:
 *                 summary: Order status doesn't allow deletion
 *                 value:
 *                   success: false
 *                   message: "Media can only be deleted for PENDING orders"
 *                   error: "BUSINESS_RULE_ERROR"
 *                   details:
 *                     currentStatus: "IN_PROGRESS"
 *                     allowedStatuses: ["PENDING"]
 *                     reason: "Order processing has begun"
 *       403:
 *         description: Access denied - not file owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_owner:
 *                 summary: Customer trying to delete another customer's file
 *                 value:
 *                   success: false
 *                   message: "Access denied"
 *                   error: "FORBIDDEN"
 *               wrong_order_owner:
 *                 summary: Customer trying to delete file from another customer's order
 *                 value:
 *                   success: false
 *                   message: "Access denied"
 *                   error: "FORBIDDEN"
 *       404:
 *         description: Media file not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               media_not_found:
 *                 summary: Media file with given ID doesn't exist
 *                 value:
 *                   success: false
 *                   message: "Media file not found"
 *                   error: "NOT_FOUND"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * tags:
 *   - name: Customer Media
 *     description: |
 *       Customer media file management for orders
 *       
 *       **Overview:**
 *       Customer Media endpoints allow customers to upload, view, and manage media files associated with their orders. These files serve as supporting materials, requirements, references, or additional context for their orders.
 *       
 *       **File Types Supported:**
 *       - **Images**: JPG, JPEG, PNG, GIF (for mockups, references, screenshots)
 *       - **Videos**: MP4, MOV, AVI (for demos, examples, tutorials)  
 *       - **Documents**: PDF (for detailed requirements, specifications)
 *       
 *       **Upload Constraints:**
 *       - Maximum 10 files per upload request
 *       - Individual file size limit: 5MB
 *       - Total upload size limit: 10MB per request
 *       - Files are stored securely in Cloudinary
 *       
 *       **Access Control:**
 *       - Customers can only access media for their own orders
 *       - ADMIN/STAFF can view all customer media files
 *       - Media upload is restricted to PENDING and IN_PROGRESS orders
 *       - Media deletion is only allowed for PENDING orders
 *       
 *       **Integration with Orders:**
 *       - Customer media files are separate from staff-uploaded media files
 *       - Customer media is always visible to the order owner
 *       - Staff media files are only shown when order status is COMPLETED
 *       - All media operations are logged in order history
 *       
 *       **Typical Workflow:**
 *       1. Customer creates an order
 *       2. Customer uploads supporting media files (requirements, references, etc.)
 *       3. Staff processes the order and may upload their own media files
 *       4. When order is completed, customer can view both their files and staff files
 *       5. Customer can delete their files only while order status is PENDING
 *       
 *       **Security Features:**
 *       - Files stored with obscured filenames in Cloudinary
 *       - Access controlled by JWT authentication
 *       - Ownership verification for all operations
 *       - Automatic cleanup on failed uploads
 *       - File type and size validation
 */
