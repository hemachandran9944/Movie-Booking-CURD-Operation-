const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    MovieTitle: ({
        type: String,
        required:  [true, 'MovieTitle name is required'],
        trim: true
    }),
    language: ({
        type: String,
        required:  [true, 'language is required'],
        trim: true,
        enum: ['Tamil',
            'English',
            'Hindi',
            'Telugu',
            'Malayalam',
            'Kannada',
            'Spanish',
            'French',
            'German',
            'Japanese',
            'Chinese'
        ],
        message: 'Invalid language. Allowed values are Tamil, English, Hindi, Telugu, Malayalam, Kannada, Spanish, French, German, Japanese, Chinese'

    }),
    MovieType: ({
        type: String,
        required:  [true, 'MovieType type is required'],
        trim: true
    }),
    Duration: ({
        type: Number,
        required:  [true, 'Duration duration is required'],
        trim: true
    }),
    ReleaseDate: ({
        type: Date,
        required:  [true, 'ReleaseDate release date is required'],
        trim: true
    }),
    Rating: ({
        type: Number,
        required:  [true, 'Rating is required'],
        min: [0, 'Rating must be at least 0'],
        max: [10, 'Rating must be at most 10'],
        default: 1,
        trim: true
    }),
    Description: ({
        type: String,
        required: [true, 'Movie description is required'],
        trim: true
    }),
    PosterImage: ({
        type: String,
        trim: true
    }),
    isActive:  ({
        type: Boolean,
        default: true
    }),
}, {timestamps:true});


module.exports = mongoose.model('Movie', MovieSchema);