const User = require('../Modules/User');
const bcrypt = require('bcryptjs');
const { RegesiterOpt, Mailer } = require('../Setting/OtpSender');
const { AuthoToken} = require('../Setting/Autho');
const { producer } = require('../Config/Kafka');


//UserRegister

exports.UserRegister = async (req, res) => {
    try {
        const {Name, Email, Password, Mobile } = req.body;
        const UserGmail = await User.findOne({Email});

        if (UserGmail) {
            return res.status(400).json({status: 'Failed', message: 'This user already registered!'});
        }

        const OneTimePassword = Math.floor(100000 + Math.random() * 900000).toString();
        const Expiry = new Date(Date.now() + 10 * 60 * 1000);

        const mailOptions = await RegesiterOpt(Name, Email, Mobile, OneTimePassword);
        await Mailer.sendMail(mailOptions);


        const Newuser = new User ({
            Name, Email, Password, Mobile, Otp: OneTimePassword, OtpExpiry: Expiry
        });
        const savedUser = await Newuser.save();

        await producer.send({
            topic: 'userResgister',
            messages: [
                {
                    value: JSON.stringify({
                        event: 'userResgister',
                        username: Name,
                        Usergmail: Email,
                        time: new Date()
                    }),
                }
            ],
        });

        return res.status(200).json({

            status: 'Success',
            message: 'User Registered and Kafka Notification Sent!',
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


// Opt Verify

exports.OtpVerify = async (req, res) => {
    try {

        const { Email, Otp } = req.body;
        const VerifyOtp = await User.findOne({ Email });

        if (!VerifyOtp) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        }

        if (String(VerifyOtp.Otp) === String(Otp)) {

            if (new Date() > VerifyOtp.OtpExpiry) {
                return res.status(400).json({ status: 'Failed', message: 'OTP Expired! Please register again.' });
            }
            VerifyOtp.isVerified = true;
            VerifyOtp.Otp = null;
            VerifyOtp.OtpExpiry = null;
            const savedUser = await VerifyOtp.save();
            return res.status(200).json({status: 'Success', message: 'Now OTP verified successfully! Now you can login.'});


        } else {
            return res.status(400).json({ status: 'Failed', message: 'Invalid OTP! Please check your email.' });
        }
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});

    }
};


// Login

exports.UserLogin = async (req, res) => {
    try {

        const { Email, Password } = req.body;
        const UserLogin = await User.findOne({Email});

        if (!UserLogin) {
            return res.status(404).json({status: 'Failed', message: 'User not found! Please register first.'});
        }

        const isMacth = await bcrypt.compare(Password, UserLogin.Password);
        if (!isMacth) {
            return res.status(400).json({status: 'Failed', message: 'Invalid password! Please try again.'});
        }
        const authorization = AuthoToken(UserLogin._id);
        return res.status(200).json({status: 'Success', message: 'Login successfully!', autho: authorization});
    } catch (error) {

        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


// Get All Users

exports.GetUserAllUser = async (req, res) => {
    try {
        const getAlluser = await User.find().select('-Password -Otp -isVerified -OtpExpiry');
        return res.status(200).json({status: 'Success', message: 'Get All Users Details Successfully', data: getAlluser, count: getAlluser.length});
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


// Get Sigel User Details

exports.GetSingleUser = async (req, res) => {
    try {
        const { id } = req.params;
        const getSingleUser = await User.findById(id).select('-Password -Otp -isVerified -OtpExpiry');
        if (!getSingleUser) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        }
        return res.status(200).json({status: 'Success', message: 'Get Single User Details Successfully', data: getSingleUser});
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


// Update User Details

exports.UpdateUser = async (req, res) => {
    try {

        const { id } = req.params;
        const { Name, Email, Mobile } = req.body;
        const updateUser = await User.findById(id, { Name, Email, Mobile }, { new: true }).select('-Password -Otp -isVerified -OtpExpiry');
        if (!updateUser) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        }

        if (Name) {
            updateUser.Name = Name;
        }

        if (Email) {
            updateUser.Email = Email;
        }

        if (Mobile) {
            updateUser.Mobile = Mobile;
        }

        const savedUser = await updateUser.save();
        return res.status(200).json({status: 'Success', message: 'User details updated successfully!', data: savedUser});
    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


// Log Out

exports.LogOut = async (req, res) => {
    try {
        return res.status(200).json({status: 'Success', message: 'Logout successfully!'});
    }
    catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


// Delte Single User

exports.DeleteSingleUser = async (req, res) =>{
    try {

        const { id } = req.params;
        const deleteUser = await User.findByIdAndDelete(id);
        if (!deleteUser) {
            return res.status(404).json({status: 'Failed', message: 'User not found'});
        }
        return res.status(200).json({status: 'Success', message: 'User deleted successfully!', data: deleteUser});

    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }
};


// All User Delete

exports.DeleteAllUsers = async (req, res) => {
    try {
        const deleteallUsers  =  await User.deleteMany({});
        return res.status(200).json({
            status: 'Success',
            message: 'Delete all users successfully!',
            Data: deleteallUsers,
            count: deleteallUsers.deletedCount
        });

    } catch (error) {
        return res.status(500).json({status: 'Failed', error: error.message});
    }

};

