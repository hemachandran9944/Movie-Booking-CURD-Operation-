const mongoose = require('mongoose');
const PaymentSchema = mongoose.Schema({
    BookingId: ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'BookingId is required'],
        trim: true,
    }),
    Amount: ({
        type: Number,
        required: [true, 'Amount is required'],
        trim: true
    }),
    TransactionId: ({
        type: String,
        required: true,
        unique: true,
        default: function() {
            return 'BookingID-' + Math.floor(100000 + Math.random() * 900000).toString();
        }
    }),
    PaymentMethod: ({
        type: String,
        required: true,
        enum: {
            values: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Wallet', 'Cash', 'Gpay', 'Other'],
            message: '{VALUE} is not a valid payment method'
        }
    }),
    PaymentStatus: ({
        type: String,
        required: true,
        enum: {
            values: ['Pending', 'Success', 'Failed', 'Confirmed', 'Cancelled'],
            message: '{VALUE} is not a valid payment status'
        }
    }),
    BookingDate: ({
        type: Date,
        default: Date.now,
        trim: true
    }),
    isActive: ({
        type: Boolean,
        default: true
    }),
}, {timestamps: true});


module.exports = mongoose.model('Payment', PaymentSchema);