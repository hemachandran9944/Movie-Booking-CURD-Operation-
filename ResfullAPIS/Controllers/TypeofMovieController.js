
const Movie = require('../Modules/Movie');


// Get Moive Type

exports.GetMovieType = async (req, res)=> {
    try {
        const MovieTitle = await Movie.distinct('MovieTitle');
        const MovieType = await Movie.distinct('MovieType');
        if (MovieTitle.length === 0) {
            return res.status(404).json({ status: 'Failed', message: 'No movie titles found' });
        }
        return res.status(200).json({ status: 'Success', MovieTitle, MovieType });
    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};
