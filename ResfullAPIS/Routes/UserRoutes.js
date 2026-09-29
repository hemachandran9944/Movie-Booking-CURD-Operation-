const express = require('express');
const router  = express.Router();
const UserController = require('../Controllers/UserControllers');
const { AuthorizationTokenVerify} = require('../Setting/Autho');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - Name
 *         - Email
 *         - Password
 *       properties:
 *         Name:
 *           type: string
 *           description: User-oda full name
 *         Email:
 *           type: string
 *           description: Unique email address
 *         Password:
 *           type: string
 *           description: Minimum 7 characters irukkanum
 *         Mobile:
 *           type: string
 *           description: 10 digit mobile number
 *         isVerified:
 *           type: boolean
 *           default: false
 */


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error (e.g., Email already exists)
 */
router.post('/register', UserController.UserRegister);

/**
 * @swagger
 * /api/user/otp-verify:
 *   post:
 *     summary: Resgister OTP Verify
 *     tags: [OTP Resgister Verify ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Otp
 *             properties:
 *               Email:
 *                 type: string
 *                 example: "hemachandranhema874@gmail.com"
 *               Otp:
 *                 type: string
 *                 example: "123478"
 *     responses:
 *       200:
 *         description: OTP Verified
 *       400:
 *         description: Invalid OTP
 */
router.post('/otp-verify', UserController.OtpVerify);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User Login
 *     tags: [User Login With Autho Token]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Password
 *             properties:
 *               Email:
 *                 type: string
 *                 example: "hema@gmail.com"
 *               Password:
 *                 type: string
 *                 example: "Hema@123"
 *     responses:
 *       200:
 *         description: Login Success + Token
 *       401:
 *         description: Invalid Credentials
 */


router.post('/login', UserController.UserLogin);

/**
 * @swagger
 * /api/user/GetAllUsers:
 *   get:
 *     summary: Get All User
 *     tags: [Get All User Details]
 *     responses:
 *       200:
 *         description: All Users List
 *       400:
 *         description: Failed
 */
router.get('/GetAllUsers', UserController.GetUserAllUser);

/**
 * @swagger
 * /api/user/GetSingleUser/{id}:
 *   get:
 *     summary: Get Sigle User
 *     tags: [Sigle User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "664abc123"
 *     responses:
 *       200:
 *         description: User Found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User Not Found
 */
router.get('/GetSingleUser/:id', AuthorizationTokenVerify, UserController.GetSingleUser);
/**
 * @swagger
 * /api/user/UpdateUser/{id}:
 *   put:
 *     summary: User Update
 *     tags: [User Details Update]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "664abc123"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 example: "hemachandranhema8754@gmail.com"
 *               Name:
 *                 type: string
 *                 example: "Hema Updated"
 *               Mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User Not Found
 */
router.put('/UpdateUser/:id', AuthorizationTokenVerify, UserController.UpdateUser);
router.post('/Logout', UserController.LogOut);
router.delete('/DeleteUser/:id', AuthorizationTokenVerify, UserController.DeleteSingleUser);
router.delete('/DeleteUsers', UserController.DeleteAllUsers);


module.exports = router;

