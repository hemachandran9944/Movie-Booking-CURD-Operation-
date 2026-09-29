const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage });

const uploadImage = async (filePath) => {
    try {

        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'movie_posters',
            use_filename: true,
            unique_filename: false,
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
        });
        fs.unlinkSync(filePath);
        return result;

    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
};


module.exports = {
    upload,
    uploadImage
};