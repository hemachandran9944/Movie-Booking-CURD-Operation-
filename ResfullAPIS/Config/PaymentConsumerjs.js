const { consumer } = require('./Kafka');
const { SendPaymentConfirmation, Mailer } = require('../Setting/OtpSender');

const startBookingConsumer = async () => {
    
    try {
        
        await consumer.subscribe({topic: 'booking-success', fromBeginning: true});
        console.log('Listen Booking Consumer');
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                let data; 
                try {
                    const data = JSON.parse(message.value.toString());
                } catch (error) {
                    console.error('Invalid JSON message, skipping');
                    return;
                }
                
                console.log(`Kafka event received! Sending email to User: ${data.Gmail}`);

                const EmailOptions = await SendPaymentConfirmation(
                    data.Name,
                    data.Gmail,
                    data.MovieTitle,
                    data.ShowDate,
                    data.ShowTime,
                    data.AmountPaid,
                    data.PosterImage,
                    data.language,
                    data.MovieType,
                    data.TransactionId
                );

                Mailer.sendMail(EmailOptions, (error, Success)=>{
                    if (error) {
                        console.log('Error sending email kafak consumer', error);
                    } else {
                        console.log(`Confirmation email sent to ${data.Gmail}`);
                    }

                });
            },
            
        });
    } catch (error) {
        console.log('Consumer initialization failed:', error.message);
    }
};


module.exports = {startBookingConsumer};