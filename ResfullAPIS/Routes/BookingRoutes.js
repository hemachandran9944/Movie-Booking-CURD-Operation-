const express = require('express');
const router = express.Router();
const BookingController = require('../Controllers/BookingController');
const { AuthorizationTokenVerify} = require('../Setting/Autho');


router.post('/BookingCreate', BookingController.CreateBooking);
router.get('/GetAllBookings',  BookingController.GetAllBooking);
router.get('/GetSingleBooking/:id', AuthorizationTokenVerify, BookingController.GetSingleBooking);
router.put('/UpdateBooking/:id', AuthorizationTokenVerify, BookingController.UpdateBooking);
router.delete('/DeleteBooking/:id', AuthorizationTokenVerify, BookingController.DeleteSigleBooking);
router.delete('/DeleteAllBookings', BookingController.DeleteAllBooking);


module.exports = router;


