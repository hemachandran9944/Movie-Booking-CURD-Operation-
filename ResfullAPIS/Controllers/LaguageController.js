const Movie = require('../Modules/Movie');

// Get Language

exports.GetLanguage = async (req, res) => {
    try {
        const languages = await Movie.distinct('language');
        if (languages.length === 0) {
            return res.status(404).json({ status: 'Failed', message: 'No languages found' });
        }

        const AvailableMovies = await Movie.distinct('MovieTitle');
        if (AvailableMovies.length === 0) {
            return res.status(404).json({ status: 'Failed', message: 'No available movies found' });
        }

        return res.status(200).json({ status: 'Success', AvailableMovies, languages });
    } catch (error) {
        return res.status(500).json({ status: 'Error', error: error.message });
    }
};
