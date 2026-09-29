
require('dotenv').config();
const jwt = require('jsonwebtoken');


const AuthoToken = (UserID) =>{
    try {
        const secretjwt = process.env.JWT_SECRET_KEY;
        if (!secretjwt) {
            throw new Error('Json web token erro. Missing .env!');
        }

        return jwt.sign(
            {id: UserID},
            secretjwt,
            {expiresIn: '4d'}
        );

    } catch (error) {
        console.log('Json web token', error.message);
        throw error;


    }
};


const AuthorizationTokenVerify = (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({status: 'Failed', message: 'Token missing or invalid'});
        }

        const token   = authHeader.split(' ')[1];
        const decode  = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user      = decode;
        return next();

    } catch(error) {
        console.log(error);
        return res.status(401).json({ status: 'Failed', message: 'Invalid or expired token'});
    }
};


module.exports = {AuthoToken, AuthorizationTokenVerify};