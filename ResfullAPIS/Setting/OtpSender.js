const nodemailer = require('nodemailer');

const Mailer =  nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


Mailer.verify ((error, success)=>{
    if (error) {
        console.log('Email connetion error',error);
    } else {
        console.log('Email server is ready to send message!',success);
    }
});


// Resgister OTP

const RegesiterOpt = async (Name, Email, Mobile, Otp) => {
    return {
        from: `Hema Theater <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'Welcome to Hema Theater! 🍿',
        text: `Dear ${Name},

To complete your registration, please use the following One-Time Password (OTP):

OTP: ${Otp}

Note: This code is valid for 10 minutes and should not be shared with anyone.

If you did not request this code, please ignore this email.

Best regards,
The Hema Theater Team`
    };
};

// Forgot Password OTP

const SendForgotPasswordOtp = async (Name, Email, Otp) => {
    return {
        from: `Hema Theater <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'Password Reset OTP for Hema Theater',
        text: `Dear  ${Name},
To reset your password, please use the following One-Time Password (OTP): ${Otp}

Note: This code is valid for 10 minutes and should not be shared with anyone.
If you did not request a password reset, please ignore this email.
Best regards,
The Hema Theater Team`
    };
};



//Send Payment Success MSG
const SendPaymentConfirmation = async (Name, Email, MovieTitle, ShowDate, ShowTime, Amount, PosterImage, language, MovieType, TransactionId) => {
    return {
        from: `Hema Theater <${process.env.EMAIL_USER}>`,
        to: Email,
        subject: 'CONFIRMED: Your Movie Ticket Booking - Hema Theater',
        text: `
Dear ${Name},

Thank you for choosing Hema Theater 🍿! 

We are pleased to confirm that your payment has been successfully processed. Your booking is now confirmed.

--- BOOKING DETAILS ---
Movie Name–${MovieTitle}
Show Date–${ShowDate}
Show Time–${ShowTime}
Language–${language}
Movie Type–${MovieType}
Transaction ID–${TransactionId}
Paid Amount–Rs.${Amount}
Poster Link –${PosterImage}
----------------------

PLEASE NOTE
-----------
1. This email serves as your booking confirmation. Present it
   at the Hema Theater counter to receive your physical tickets.

2. Kindly arrive 15–20 minutes prior to showtime.

3. This is a system-generated email. For queries, contact us at 
   hemachandranhema8754@gmail.com or call +91-87543 15708.

Enjoy your movie!

Best Regards,
Hema Theater Team
Chrompet, Chennai.
        `
    };
};

module.exports = {RegesiterOpt, SendForgotPasswordOtp, SendPaymentConfirmation, Mailer};