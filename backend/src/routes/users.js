const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/roles");

require('../docs/userDocs');

router.patch("/users/role",authenticateToken,authorizeRoles("ADMIN"), userController.updateUserRole);

module.exports = router;