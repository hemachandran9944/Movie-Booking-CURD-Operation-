const { producer } = require('../Config/Kafka');
const Booking = require('../Modules/Booking');
const  Payment = require('../Modules/Payment');
const mongoose = require('mongoose');


exports.CreatePayment = async (req, res) => {
    const session = await mongoose.startSession();
    let savedPayment;
    try {
        session.startTransaction();
        const { BookingId, Amount, PaymentMethod, PaymentStatus } = req.body;
        const payment = new Payment({
            BookingId: BookingId.trim(),
            Amount,
            PaymentMethod,
            PaymentStatus: PaymentStatus || 'Success',
        });

        savedPayment = await payment.save({ session });

        if (savedPayment.PaymentStatus === 'Confirmed' || savedPayment.PaymentStatus === 'Success') {
            await Booking.findByIdAndUpdate(BookingId.trim(), { Status: 'Confirmed' }, { session });
        }
        await session.commitTransaction();
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        return res.status(400).json({ status: 'Failed', message: error.message });
    } finally {
        session.endSession();
    }

    try {
        const PaymentDetail = await Payment.findById(savedPayment._id)
            .populate({
                path: 'BookingId',
                populate: [
                    { path: 'Movie', select: 'MovieTitle MovieType language PosterImage' },
                    { path: 'User', select: 'Name Email' }
                ]
            });

        if (!PaymentDetail || !PaymentDetail.BookingId ||
            !PaymentDetail.BookingId.User || !PaymentDetail.BookingId.Movie) {
            console.error('Booking / User / Movie not found for payment:', savedPayment._id);
            return res.status(201).json({
                status: 'Success',
                message: 'Payment saved, but booking/user/movie details not found. Mail not sent.',
                data: savedPayment
            });
        }

        const Booked = PaymentDetail.BookingId;

        try {
            await producer.send({
                topic: 'booking-success',
                messages: [{
                    value: JSON.stringify({
                        event: 'Booking Success',
                        Name: Booked.User.Name,
                        Gmail: Booked.User.Email,
                        MovieTitle: Booked.Movie.MovieTitle,
                        ShowDate: Booked.ShowDate.toDateString(),
                        ShowTime: Booked.ShowTime,
                        AmountPaid: PaymentDetail.Amount,
                        PosterImage: Booked.Movie.PosterImage,
                        language: Booked.Movie.language,
                        MovieType: Booked.Movie.MovieType,
                        TransactionId: PaymentDetail.TransactionId
                    }),
                }],
            });
            console.log('Kafka Booking Success Event Sent! To:', Booked.User.Email);
        } catch (kafkaError) {
            console.error('Kafka send failed:', kafkaError);
        }

        return res.status(201).json({ status: 'Success', data: PaymentDetail });
    } catch (error) {
        console.error('Post-payment error:', error);
        return res.status(201).json({
            status: 'Success',
            message: 'Payment saved, but follow-up failed: ' + error.message,
            data: savedPayment
        });
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