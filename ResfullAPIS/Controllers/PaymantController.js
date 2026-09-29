const { producer } = require('../Config/Kafka');
const Booking = require('../Modules/Booking');
const  Payment = require('../Modules/Payment');
const mongoose = require('mongoose');


exports.CreatePayment = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { BookingId, Amount, PaymentMethod, PaymentStatus } = req.body;
        const payment =  new Payment({
            BookingId: BookingId.trim(),
            Amount,
            PaymentMethod,
            PaymentStatus: PaymentStatus || 'Success',
        });


        const savedPayment = await payment.save({session});

        if (!savedPayment) {
            return res.status(400).json({status: 'Failed', message: 'Payment creation failed!'});
        }


        if (savedPayment.PaymentStatus === 'Confirmed' || savedPayment.PaymentStatus === 'Success') {
            await Booking.findByIdAndUpdate(BookingId.trim(), { Status: 'Confirmed' }, {session});
        }

        await session.commitTransaction();
        session.endSession();

        const PaymentDetail = await Payment.findById(savedPayment._id)
            .populate({
                path: 'BookingId',
                populate: [
                    {path: 'Movie', select: 'MovieTitle MovieType language PosterImage'},
                    {path: 'User', select: 'Name Email'}
                ]
            });

        const Gmail         =  PaymentDetail.BookingId.User.Email;
        const Name          =  PaymentDetail.BookingId.User.Name;
        const MovieTitle    =  PaymentDetail.BookingId.Movie.MovieTitle;
        const MovieType     =  PaymentDetail.BookingId.Movie.MovieType;
        const Language      =  PaymentDetail.BookingId.Movie.language;
        const PosterImage   =  PaymentDetail.BookingId.Movie.PosterImage;
        const ShowDate      =  PaymentDetail.BookingId.ShowDate.toDateString();
        const ShowTime      =  PaymentDetail.BookingId.ShowTime;
        const AmountPaid    =  PaymentDetail.Amount;
        const TransactionId =  PaymentDetail.TransactionId;

        await producer.send({
            topic: 'booking-success',
            messages: [
                {
                    value: JSON.stringify({
                        event: 'Booking Success',
                        Name, 
                        Gmail, 
                        MovieTitle, 
                        ShowDate, 
                        ShowTime, 
                        AmountPaid, 
                        PosterImage, 
                        language: Language,
                        MovieType, 
                        TransactionId

                    }),
                }
            ],
        });
        console.log('Kafka Booking Success Event Sent!');
        
        return res.status(201).json({status: 'Success', data: PaymentDetail});

    } catch (error) {

        try {
            if (session.inTransaction()) {
                await session.abortTransaction();
            }
        } finally {
            session.endSession();
        }
        return res.status(400).json({ status: 'Failed', message: error.message });
    }
};


// Get All Payment

exports.GetAllPayment = async (req, res) => {
    try {
        const PayemntData = await Payment.find()
            .populate({
                path: 'BookingId',
                populate: [
                    {path: 'Movie', select: 'MovieTitle MovieType language PosterImage'},
                    {path: 'User', select: 'Name Email'}
                ]
            });
        return res.status(200).json({status: 'Success', data: PayemntData, count: PayemntData.length});
    } catch (error) {
        return res.status(400).json({status: 'Failed', message: error.message});
    }
};


// Get Sigle Payment

exports.GetSinglePayment = async (req, res) => {
    try {
        const PaymentID = req.params.id;
        const PayemntData = await Payment.findById(PaymentID)

            .populate({
                path: 'BookingId',
                populate: [
                    {path: 'Movie', select: 'MovieTitle MovieType language PosterImage'},
                    {path: 'User', select: 'Name Email'}
                ]
            });

        if (!PayemntData) {
            return res.status(404).json({status: 'Failed', message: 'Payment not found!'});
        }

        return res.status(200).json({status: 'Success', data: PayemntData});
    } catch (error) {
        return res.status(400).json({status: 'Failed', message: error.message});
    }
};


// Update Payment

exports.UpdatePayment = async (req, res) => {
    try {

        const { BookingId, Amount, PaymentMethod, PaymentStatus } = req.body;
        const PaymentID = req.params.id;
        const updatedPayment = await Payment.findById(PaymentID)
            .populate({
                path: 'BookingId',
                populate: [
                    {path: 'Movie', select: 'MovieTitle MovieType language PosterImage'},
                    {path: 'User', select: 'Name Email'}
                ]
            });
        if (!updatedPayment) {
            return res.status(404).json({status: 'Failed', message: 'Payment not found!'});
        }

        if (BookingId) {
            updatedPayment.BookingId = BookingId.trim();
        }

        if (Amount) {
            updatedPayment.Amount = Amount;
        }
        if (PaymentMethod) {
            updatedPayment.PaymentMethod = PaymentMethod;
        }

        if (PaymentStatus) {
            updatedPayment.PaymentStatus = PaymentStatus;
        }

        const SavePayment = await updatedPayment.save();
        return res.status(200).json({status: 'Success', data: SavePayment});

    } catch (error) {
        return res.status(400).json({status: 'Failed', message: error.message});
    }
};


// Delete Sigle Payment

exports.DeletesinglePayment = async (req, res) => {
    try {
        const PaymentID = req.params.id;
        const deletePayment = await Payment.findByIdAndDelete(PaymentID);

        if(!deletePayment) {
            return res.status(404).json({status: 'Failed', message: 'Payment not found!'});
        }
        return res.status(200).json({status: 'Success', message: 'Payment deleted successfully', data: deletePayment});

    } catch (error) {
        return res.status(400).json({status: 'Failed', message: error.message});

    }
};


// Delete ALL Payment

exports.DeleteAllPayment = async (req, res) => {
    try {
        const deleteAllUser  = await Payment.deleteMany({});
        return res.status(200).json({status: 'Success', data: deleteAllUser, count: deleteAllUser.deleteCount});
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};