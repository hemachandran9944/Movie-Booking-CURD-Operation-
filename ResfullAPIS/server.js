require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/AtlesDB');
const {connectKafka} = require('./Config/Kafka');
const { startBookingConsumer } = require('./Config/PaymentConsumerjs'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Config/Swgger');


const UserController = require('./Routes/UserRoutes');
const PasswordController = require('./Routes/PasswordRoutes');
const MovieController = require('./Routes/MoiveRoutes');
const TypeOfMovieController = require('./Routes/TypeofMovie');
const LaguageController = require('./Routes/LaguageRoutes');
const BookingController = require('./Routes/BookingRoutes');
const PaymentController = require('./Routes/PaymentRoutes');


const app = express();
app.use(express.json());


app.use((req, res, next)=>{
    if (!req.url.includes('/api-docs')) {

        console.log(`${req.method} request to: ${req.url}`);
    }
    next();

});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Gateways

app.use('/api/user', UserController);
app.use('/api/password', PasswordController);
app.use('/api/movie', MovieController);
app.use('/api/movietype', TypeOfMovieController);
app.use('/api/language', LaguageController);
app.use('/api/booking', BookingController);
app.use('/api/payment', PaymentController);


app.use((req, res)=>{
    res.status(404).json({status: 'Failed', message: 'Page not found, Please check URL'});
});


async function Startserver() {
    try {

        await connectDB();
        await connectKafka();
        await startBookingConsumer(); 
        
        const PORT  = process.env.PORT || 8000;
        app.listen(PORT, ()=>{
            console.log(` Server running on port ${PORT}`);
            console.log(` Swagger docs: http://localhost:${PORT}/api-docs`);
        });


    } catch (error) {
        console.error('Server start failed:', error.message);
        process.exit(1);
    }
}

Startserver();
