
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roles");
const { validateRequest } = require('../middleware/validation');
const {registerAdminSchema} = require('../validations/adminValidation')
require('../docs/adminDocs');

router.post("/register",authenticateToken,authorizeRoles("ADMIN"),validateRequest(registerAdminSchema),adminController.registerAdmin);

module.exports = router;
