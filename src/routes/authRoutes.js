const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

// home page
router.get('/', authController.home);
// login page
router.get('/login', authController.login);
// user profile page
router.get('/profile', authController.profile);
// logout page
router.get('/logout', authController.logout);
// redirect URL for corbado auth
router.get('/api/sessionToken', authController.authRedirect);

module.exports = router;