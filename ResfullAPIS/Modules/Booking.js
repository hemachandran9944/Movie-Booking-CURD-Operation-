const mongoose = require('mongoose');
const BookingSchema = mongoose.Schema({
    User : ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    }),
    Movie: ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie is required'],
    }),
    ShowDate: ({
        type: Date,
        required: [true, 'ShowDate is required'],
    }),
    ShowTime: ({
        type: String,
        required: [true, 'ShowTime is required'],
    }),
    SelectedSeats: ({
        type: [String],
        required: [true, 'SelectedSeats is required'],
    }),
    SeatCount: ({
        type: Number,
        required: [true, 'SeatCount is required'],
    }),
    Status: ({
        type: String,
        required: true,
        enum: {
            values: ['Confirmed', 'Cancelled', 'Pending'],
            message: '{VALUE} is not a valid booking status',
        },
        default: 'Pending'
    }),

}, {timestamps: true});


module.exports = mongoose.model('Booking', BookingSchema);