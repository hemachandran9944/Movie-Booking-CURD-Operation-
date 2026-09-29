const { Kafka, logLevel } = require('kafkajs');


const kafka = new Kafka({
    clientId: 'Hema-Movie-Booking',
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    logLevel: logLevel.error
});

const producer = kafka.producer();

const consumer = kafka.consumer({ groupId: 'Movie-Group' });

const connectKafka = async () => {
    try {
        await producer.connect();
        await consumer.connect();
        console.log('Kafka Connected Successfully!');
    } catch (error) {
        console.error('Kafka Connection Failed', error.message);
        throw error;
    }
};

producer.on('producer.disconnect', () => console.error('Kafka producer disconnected!'));
consumer.on('consumer.disconnect', () => console.error('Kafka consumer disconnected!'));


module.exports = { kafka, producer, consumer, connectKafka};