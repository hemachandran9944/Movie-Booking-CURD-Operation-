const express = require('express');
const router  = express.Router();
const PasswordController = require('../Controllers/PasswordControllers');

router.post('/forgot-password-otp', PasswordController.ForgotPasswordOtp);
router.post('/reset-password', PasswordController.ResetPassword);

module.exports = router;
