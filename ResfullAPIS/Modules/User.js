
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = mongoose.Schema({
    Name: ({
        type: String,
        required: [true, 'Name is required'],
        trim: true
    }),
    Email: ({
        type: String,
        require: [true, 'Email is required'],
        unique: true,
        trim: true
    }),
    Password: ({
        type: String,
        require: [true, 'Password is required'],
        minlength: 7
    }),
    Mobile: ({
        type: String,
        minlength: 10
    }),
    Otp: ({
        type: String,
        default: null
    }),
    isVerified: ({
        type: Boolean,
        default: false
    }),
    OtpExpiry: ({
        type: Date,
        default: null
    }),


} ,{timestamps:true});

UserSchema.pre('save', async function () {

    if (!this.isModified('Password'))
    {return;}

    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        console.log('Hash password',this.Password);

    } catch (error) {
        console.log('Password hash error', error);
        throw error;
    }
});


module.exports = mongoose.model('User', UserSchema);