const Movie = require('../Modules/Movie');
const { uploadImage } = require('../Config/Cloudinary');

//Movie Create

exports.MovieCreate = async (req, res) => {
    try {
        const { MovieTitle, language, MovieType, Duration, ReleaseDate, Rating, Description } = req.body;
        let PosterURL = null;
        try {

            if(req.file) {

                const result = await uploadImage(req.file.path);
                PosterURL = result.secure_url;

            }
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ status: 'Error', message: 'Failed to upload poster image' });
        }
        const newMovie = await Movie.create({
            MovieTitle,
            language,
            MovieType,
            Duration,
            ReleaseDate,
            Rating,
            Description,
            PosterImage: PosterURL
        });

        return res.status(201).json({ status: 'Success',message: 'Movie created successfully', movie: newMovie });
    } catch (error) {
        console.error('Error creating movie:', error);
        return res.status(500).json({ status: 'Error', error: error.message });

    }
};


// Get Sigle User

exports.GetSingleMovie = async (req, res) => {
    try {
        const MovieId  = req.params.id;
        const MovieData = await Movie.findById(MovieId);
        if (!MovieData) {
            return res.status(404).json({ status: 'Failed', message: 'Movie not found' });
        } else {

            return res.status(200).json({ status: 'Success', movie: MovieData });
        }

    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};


// Get All Movies

exports.GetAllMovies = async (req, res) => {
    try {
        const AllMovies = await Movie.find();
        return res.status(200).json({ status: 'Success', movies: AllMovies, count: AllMovies.length });
    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};


// Movie Update

exports.UpdateMovies = async (req, res) => {
    try {

        const UpdatePosterURL = {...req.body};
        try {
            if (req.file) {

                const Result = await uploadImage(req.file.path);
                UpdatePosterURL.PosterImage = Result.secure_url;
                console.log('Poster image uploaded successfully:', UpdatePosterURL);
            }

        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ status: 'Error', message: 'Failed to upload poster image' });

        }
        const MovieId  = req.params.id;
        const UpdatedMovie = await Movie.findByIdAndUpdate(MovieId,  UpdatePosterURL, { new: true, runValidators: true });

        if (!UpdatedMovie) {
            return res.status(404).json({ status: 'Failed', message: 'Movie not found' });
        }

        return res.status(200).json({ status: 'Success', message: 'Movie updated successfully', movie: UpdatedMovie });

    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};


// Delete Single Movie

exports.DeleteSingleMovie = async (req, res) => {
    try {

        const DeletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!DeletedMovie) {
            return res.status(404).json({ status: 'Failed', message: 'Movie not found' });
        }
        return res.status(200).json({ status: 'Success', message: 'Movie deleted successfully', movie: DeletedMovie });
    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};


// Delete All Movies

exports.DeleteAllMovies  = async (req, res) => {
    try {
        const MovieDelete = await Movie.deleteMany();
        return res.status(200).json({ status: 'Success', message: 'All movies deleted successfully', count: MovieDelete.deletedCount});
    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};


