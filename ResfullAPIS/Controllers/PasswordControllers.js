const User = require('../Modules/User');
const bcrypt = require('bcryptjs');
const {SendForgotPasswordOtp, Mailer} = require('../Setting/OtpSender');


// Verify Forgot Password OTP and Reset Password

exports.ForgotPasswordOtp = async (req, res) => {
    try {

        const {Email} = req.body;
        const UserEmail = await User.findOne({Email});

        if (!UserEmail) {
            return res.status(400).json({status: 'Failed', message: 'This email is not registered!'});
        }

        const OneTimePassword = Math.floor(100000 + Math.random() * 900000).toString();
        const Expiry = new Date(Date.now() + 10 * 60 * 1000);

        console.log('One Time Password:', OneTimePassword);
        console.log('User Email:', Email);

        const mailOptions = await SendForgotPasswordOtp(UserEmail.Name, Email, OneTimePassword);
        await Mailer.sendMail(mailOptions);

        UserEmail.Otp = OneTimePassword;
        UserEmail.OtpExpiry = Expiry;
        const savedUser = await UserEmail.save();


        return res.status(200).json({
            status: 'Success',
            message: 'OTP sent to your email! Please check and verify.',
            Data: {
                id: savedUser._id,
                Name: savedUser.Name,
                Email: savedUser.Email,
                Otp: savedUser.Otp,
                OtpExpiry: savedUser.OtpExpiry
            }
        });
    } catch (error) {

        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


exports.ResetPassword = async (req, res) => {
    try {
        const {Email, Otp, NewPassword, ConfirmPassword} = req.body;
        const UserEmail = await User.findOne({Email});

        if (!UserEmail) {
            return res.status(400).json({status: 'Failed', message: 'This email is not registered!'});
        }
        if (UserEmail.Otp !== Otp || UserEmail.OtpExpiry < new Date()) {
            return res.status(400).json({status: 'Failed', message: 'Invalid or expired OTP!'});
        }

        if (NewPassword !== ConfirmPassword) {
            return res.status(400).json({status: 'Failed', message: 'Passwords do not match!'});
        }

        const hashedPassword = await bcrypt.hash(NewPassword, 12);
        UserEmail.Password = hashedPassword;
        UserEmail.Otp = undefined;
        UserEmail.OtpExpiry = undefined;
        await UserEmail.save();

        return res.status(200).json({status: 'Success', message: 'Password updated successfully!'});
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};