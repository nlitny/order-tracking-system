
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

module.exports = {
  cloudinary,
  upload
};
