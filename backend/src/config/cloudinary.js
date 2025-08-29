const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'order-media',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'mov', 'avi'],
    resource_type: 'auto',
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  },
});

const streamStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'admin-media',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'pdf', 'mov', 'avi', 'mkv', 'webm', 'flv'],
    resource_type: 'auto',
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

const streamUpload = multer({
  storage: streamStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_ADMIN_FILE_SIZE) || 500 * 1024 * 1024, 
    files: 20
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      
    
      'video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm', 'video/flv',
      'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/3gpp',
      'video/vnd.dlna.mpeg-tts', 
      'video/mp2t', 
      'video/mpeg', 'video/x-flv',
      
      
      'audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg',
      
      
      'application/pdf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed for admin upload`), false);
    }
  }
});

module.exports = {
  cloudinary,
  upload,
  streamUpload
};
