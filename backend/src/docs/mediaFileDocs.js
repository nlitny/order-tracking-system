
/**
 * @swagger
 * components:
 *   schemas:
 *     MediaFile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "clcm123456789"
 *           description: "Unique identifier for the media file"
 *         fileName:
 *           type: string
 *           example: "admin_upload_1693234567890.jpg"
 *           description: "Cloudinary filename (system generated)"
 *         originalName:
 *           type: string
 *           example: "project_reference.jpg"
 *           description: "Original filename when uploaded"
 *         mimeType:
 *           type: string
 *           example: "image/jpeg"
 *           description: "MIME type of the file"
 *         size:
 *           type: integer
 *           example: 5242880
 *           description: "File size in bytes"
 *         fileType:
 *           type: string
 *           enum: [IMAGE, VIDEO, DOCUMENT, AUDIO, OTHER]
 *           example: "IMAGE"
 *           description: "Categorized file type"
 *         path:
 *           type: string
 *           example: "https://res.cloudinary.com/yourcloud/image/upload/v1693234567890/admin-media/admin_upload_1693234567890.jpg"
 *           description: "Full Cloudinary URL for file access"
 *         isPublic:
 *           type: boolean
 *           example: true
 *           description: "Whether file is publicly accessible"
 *         description:
 *           type: string
 *           example: "Project reference material"
 *           description: "Optional file description"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-30T14:30:00.000Z"
 *           description: "Upload timestamp"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-08-30T14:30:00.000Z"
 *           description: "Last update timestamp"
 *
 *     MediaFileUploadResponse:
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
 *               example: 5
 *               description: "Number of files successfully uploaded"
 *             mediaFiles:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MediaFile'
 *               description: "Details of all uploaded files"
 *
 *     MediaFileListResponse:
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
 *                 $ref: '#/components/schemas/MediaFile'
 *             count:
 *               type: integer
 *               example: 8
 *               description: "Total number of media files for this order"
 *
 *     MediaFileUpdateRequest:
 *       type: object
 *       properties:
 *         description:
 *           type: string
 *           example: "Updated project reference material"
 *           description: "File description"
 *         isPublic:
 *           type: boolean
 *           example: false
 *           description: "Set file visibility"
 *
 *     AdminFileUploadConstraints:
 *       type: object
 *       description: "File upload constraints for admin/staff"
 *       properties:
 *         maxFileSize:
 *           type: string
 *           example: "50MB per file"
 *           description: "Maximum individual file size for admin/staff"
 *         maxTotalSize:
 *           type: string
 *           example: "100MB total"
 *           description: "Maximum total size for all files in single upload"
 *         maxFiles:
 *           type: integer
 *           example: 20
 *           description: "Maximum number of files per upload"
 *         allowedFormats:
 *           type: array
 *           items:
 *             type: string
 *           example: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "avi", "mkv", "webm", "flv", "pdf", "mp3", "wav"]
 *           description: "Supported file formats for admin/staff"
 *         streamProcessing:
 *           type: boolean
 *           example: true
 *           description: "Stream processing capability for large files"
 *
 * /api/v1/orders/{id}/mediafiles:
 *   post:
 *     summary: Upload media files for an order (Admin/Staff only)
 *     description: |
 *       Allows admin and staff users to upload media files with stream processing capability.
 *
 *       **🔒 Access Restrictions:**
 *       - Only ADMIN and STAFF users can upload media files
 *       - Higher file size limits compared to customer uploads
 *       - Stream processing for large files
 *
 *       **📁 Enhanced File Constraints:**
 *       - Maximum 20 files per upload request
 *       - Individual file size: 50MB maximum
 *       - Total upload size: 100MB maximum per request
 *       - Extended format support: JPG, PNG, GIF, WEBP, MP4, MOV, AVI, MKV, WEBM, FLV, PDF, MP3, WAV
 *
 *       **☁️ Advanced Storage:**
 *       - Files stored in dedicated admin-media folder
 *       - Stream processing for better performance
 *       - Enhanced file type detection
 *       - Public visibility by default
 *       - Metadata tracking and descriptions
 *
 *       **🚀 Stream Processing:**
 *       - Optimized for large file uploads
 *       - Real-time processing during upload
 *       - Better memory management
 *       - Progress tracking capability
 *
 *       **🎯 Admin/Staff Use Cases:**
 *       - Upload project deliverables
 *       - Share high-quality reference materials
 *       - Provide training or tutorial videos
 *       - Store project documentation
 *       - Archive completed work
 *     tags: [Admin Media Files]
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
 *                 maxItems: 20
 *                 description: "Media files to upload (1-20 files)"
 *             required: ["files"]
 *           encoding:
 *             files:
 *               contentType: "image/*, video/*, application/pdf, audio/*"
 *     responses:
 *       201:
 *         description: Media files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaFileUploadResponse'
 *             examples:
 *               successful_upload:
 *                 summary: Successful file upload
 *                 value:
 *                   status: "success"
 *                   message: "Media files uploaded successfully"
 *                   data:
 *                     uploadedFiles: 3
 *                     mediaFiles:
 *                       - id: "clx123456789"
 *                         fileName: "admin_upload_1693234567890.jpg"
 *                         originalName: "project_mockup.jpg"
 *                         mimeType: "image/jpeg"
 *                         size: 2048576
 *                         fileType: "IMAGE"
 *                         path: "https://res.cloudinary.com/yourcloud/image/upload/v1693234567890/admin-media/admin_upload_1693234567890.jpg"
 *                         isPublic: true
 *                         description: null
 *                         createdAt: "2025-08-30T14:30:00.000Z"
 *                         updatedAt: "2025-08-30T14:30:00.000Z"
 *       400:
 *         description: Bad Request - Validation or constraint violations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *             examples:
 *               no_files:
 *                 summary: No files provided
 *                 value:
 *                   status: "error"
 *                   message: "No files uploaded"
 *               size_exceeded:
 *                 summary: File size limit exceeded
 *                 value:
 *                   status: "error"
 *                   message: "Total file size exceeds 50MB limit"
 *               too_many_files:
 *                 summary: Too many files
 *                 value:
 *                   status: "error"
 *                   message: "Maximum 20 files allowed per upload"
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Authentication token required"
 *       403:
 *         description: Forbidden - Admin/Staff access only
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Access denied. Only admin and staff can upload media files"
 *       404:
 *         description: Not Found - Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Order not found"
 *       413:
 *         description: Payload Too Large - Individual file exceeds size limit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "File size exceeds 50MB limit"
 *       415:
 *         description: Unsupported Media Type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "File type not supported for admin upload"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Error uploading media files"
 *
 *   get:
 *     summary: Get media files for an order (Admin/Staff only)
 *     description: |
 *       Retrieve all media files uploaded by admin/staff for a specific order.
 *       
 *       **🔒 Access Control:**
 *       - Only ADMIN and STAFF users can retrieve media files
 *       - Full access to all file metadata including descriptions
 *       - View both public and private files
 *       
 *       **📋 Response Data:**
 *       - Complete list of all admin/staff uploaded media files
 *       - File metadata including size, type, visibility status
 *       - Creation and modification timestamps
 *       - Direct Cloudinary URLs for file access
 *       
 *       **🔍 File Information:**
 *       - Original and system-generated filenames
 *       - File types and MIME types
 *       - File sizes and descriptions
 *       - Public/private status
 *       - Upload and update timestamps
 *     tags: [Admin Media Files]
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
 *         description: Media files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaFileListResponse'
 *             examples:
 *               media_files_found:
 *                 summary: Order with media files
 *                 value:
 *                   status: "success"
 *                   data:
 *                     mediaFiles:
 *                       - id: "clx123456789"
 *                         fileName: "admin_upload_1693234567890.jpg"
 *                         originalName: "project_deliverable.jpg"
 *                         mimeType: "image/jpeg"
 *                         size: 3145728
 *                         fileType: "IMAGE"
 *                         path: "https://res.cloudinary.com/yourcloud/image/upload/v1693234567890/admin-media/admin_upload_1693234567890.jpg"
 *                         isPublic: true
 *                         description: "Final project deliverable"
 *                         createdAt: "2025-08-30T14:30:00.000Z"
 *                         updatedAt: "2025-08-30T15:00:00.000Z"
 *                     count: 1
 *               no_media_files:
 *                 summary: Order without media files
 *                 value:
 *                   status: "success"
 *                   data:
 *                     mediaFiles: []
 *                     count: 0
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin/Staff access only
 *       404:
 *         description: Not Found - Order not found
 *       500:
 *         description: Internal Server Error
 *
 * /api/v1/orders/mediafiles/{mediaId}:
 *   put:
 *     summary: Update media file information (Admin/Staff only)
 *     description: |
 *       Update metadata for an existing media file such as description and visibility status.
 *       
 *       **🔒 Access Control:**
 *       - Only ADMIN and STAFF users can update media files
 *       - Can modify file descriptions and visibility settings
 *       - Cannot modify file content, only metadata
 *       
 *       **✏️ Updatable Fields:**
 *       - `description`: Add or modify file description
 *       - `isPublic`: Change file visibility (public/private)
 *       
 *       **🚫 Non-Updatable Fields:**
 *       - File content and path (immutable after upload)
 *       - File size and MIME type
 *       - Original filename and system filename
 *       - Creation timestamp
 *     tags: [Admin Media Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Media file ID to update
 *         example: "clx123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MediaFileUpdateRequest'
 *           examples:
 *             update_description:
 *               summary: Update file description
 *               value:
 *                 description: "Updated project reference material with annotations"
 *             change_visibility:
 *               summary: Change file visibility
 *               value:
 *                 isPublic: false
 *             full_update:
 *               summary: Update multiple fields
 *               value:
 *                 description: "Final approved deliverable"
 *                 isPublic: true
 *     responses:
 *       200:
 *         description: Media file updated successfully
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
 *                   example: "Media file updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     mediaFile:
 *                       $ref: '#/components/schemas/MediaFile'
 *       400:
 *         description: Bad Request - Invalid update data
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin/Staff access only
 *       404:
 *         description: Not Found - Media file not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete media file (Admin/Staff only)
 *     description: |
 *       Permanently delete a media file from both database and Cloudinary storage.
 *       
 *       **🔒 Access Control:**
 *       - Only ADMIN and STAFF users can delete media files
 *       - Permanent deletion with no recovery option
 *       - Automatic cleanup from cloud storage
 *       
 *       **🗑️ Deletion Process:**
 *       1. Verify user permissions (Admin/Staff only)
 *       2. Remove file from Cloudinary storage
 *       3. Delete database record
 *       4. Log deletion activity in order history
 *       5. Return confirmation response
 *       
 *       **📝 Activity Logging:**
 *       - Deletion is logged in order history
 *       - Includes file name and admin/staff user ID
 *       - Metadata includes Cloudinary ID for audit trail
 *       
 *       **⚠️ Warning:**
 *       This action is irreversible. Once deleted, the file cannot be recovered.
 *     tags: [Admin Media Files]
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
 *         example: "clx123456789"
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
 *                 summary: File deleted successfully
 *                 value:
 *                   status: "success"
 *                   message: "Media file deleted successfully"
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin/Staff access only
 *       404:
 *         description: Not Found - Media file not found
 *       500:
 *         description: Internal Server Error - Deletion failed
 */
