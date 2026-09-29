
const mongoose  = require('mongoose');

const  MongoDB = async () => {
    try {
        const connectionURL = process.env.MONGODB_CONNETING_URL || 'mongodb://hemachandranhema8754_db_user:F09oZcrRvHjg9hvj@ac-cduwql2-shard-00-00.62bc372.mongodb.net:27017,ac-cduwql2-shard-00-01.62bc372.mongodb.net:27017,ac-cduwql2-shard-00-02.62bc372.mongodb.net:27017/HemaTheater?ssl=true&replicaSet=atlas-fmbi4s-shard-0&authSource=admin&retryWrites=true&w=majority';

        await mongoose.connect(connectionURL);

        console.log('Cloude Atles MongoDB Connect successfulley!');


    } catch (error) {

        console.log('MongoDB Connection Error:', error.message);

    }
};


module.exports = MongoDB;