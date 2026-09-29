const express = require('express');
const router = express.Router();
const PaymantController  = require('../Controllers/PaymantController');
const { AuthorizationTokenVerify} = require('../Setting/Autho');

router.post('/payment', PaymantController.CreatePayment);

router.get('/Getallpayment' , PaymantController.GetAllPayment);
router.get('/GetSinglePayment/:id' , AuthorizationTokenVerify, PaymantController.GetSinglePayment);

router.put('/UpdatePayment/:id' , AuthorizationTokenVerify, PaymantController.UpdatePayment);

router.delete('/DeletePayment/:id' , AuthorizationTokenVerify, PaymantController.DeletesinglePayment);
router.delete('/DeleteAllUser/:id', PaymantController.DeleteAllPayment);


module.exports = router;
