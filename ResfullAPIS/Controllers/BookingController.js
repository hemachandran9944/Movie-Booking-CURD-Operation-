const Booking = require('../Modules/Booking');

// CreateBooking

exports.CreateBooking = async (req, res) => {
    try {
        const { User: UserID, Movie: MovieID, ShowDate, ShowTime, SelectedSeats} = req.body;
        const newBooking = {
            User: UserID.trim(),
            Movie: MovieID.trim(),
            ShowDate: ShowDate,
            ShowTime: ShowTime,
            SelectedSeats: SelectedSeats,
            SeatCount: SelectedSeats.length,
            Status: 'Pending'
        };
        const bookingData = await Booking.create(newBooking);

        const AllData = await Booking.findById(bookingData._id)
            .populate('Movie', 'MovieTitle MovieType language PosterImage')
            .populate('User', 'Name Email Mobile');

        if (!AllData || !AllData.Movie || !AllData.User) {
            return res.status(404).json({ status: 'Failed', message: 'User or Movie details not found in database. Check the IDs.' });
        }

        return res.status(201).json({
            status: 'Success',
            message: 'Booking created successfully',
            Booking: AllData,
            MovieDetails: {

                MovieList: AllData.Movie.MovieTitle,
                MovieType: AllData.Movie.MovieType,
                Language: AllData.Movie.language,
                Poster: AllData.Movie.PosterImage
            },

            UserDetails: {
                UserName: AllData.User.Name,
                UserEmail: AllData.User.Email,
                UserMobile: AllData.User.Mobile

            },

        });

    } catch (error) {
        return res.status(500).json({ status: 'Error', message: 'Failed to create booking', error: error.message });
    }
};


// Get All Booking


exports.GetAllBooking = async (req, res) => {
    try {
        const ALLBookings = await Booking.find()
            .populate('Movie', 'MovieTitle MovieType language PosterImage')
            .populate('User', 'Name Email Mobile');
        return res.status(200).json({ status: 'Success', Bookings: ALLBookings, count: ALLBookings.length });
    } catch (error) {
        return res.status(500).json({ status: 'Error', message: 'Failed to retrieve bookings', error: error.message });
    }
};


// GetSigleBooking

exports.GetSingleBooking = async (req, res) => {
    try {
        const bookingId = req.params.id.trim();
        const booking = await Booking.findById(bookingId)
            .populate('Movie', 'MovieTitle MovieType language PosterImage')
            .populate('User', 'Name Email Mobile');
        if (!booking) {
            return res.status(404).json({ status: 'Failed', message: 'Booking not found' });
        }
        return res.status(200).json({ status: 'Success', Booking: booking });
    } catch(error) {
        return res.status(500).json({ status: 'Error', message: 'Failed to retrieve booking', error: error.message });
    }
};


// Update Booking

exports.UpdateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id.trim();
        const updateData = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true })
            .populate('Movie', 'MovieTitle MovieType language PosterImage')
            .populate('User', 'Name Email Mobile');

        if (!updatedBooking) {
            return res.status(404).json({ status: 'Failed', message: 'Booking not found' });
        }

        return res.status(200).json({ status: 'Success', Booking: updatedBooking });
    } catch (error) {
        return res.status(500).json({ status: 'Error', message: 'Failed to update booking', error: error.message });
    }
};


// Delete Booking

exports.DeleteSigleBooking = async (req, res) => {
    try {
        const BokkingID = req.params.id.trim();
        const deleteBooking = await Booking.findByIdAndDelete(BokkingID);
        if (!deleteBooking) {
            return res.status(404).json({ status: 'Failed', message: 'Booking not found' });
        }
        return res.status(200).json({ status: 'Success', message: 'Booking deleted successfully', data: deleteBooking });
    } catch (error) {
        return res.status(500).json({ status: 'Error', message: 'Failed to delete booking', error: error.message });
    }
};


// DleteAllBooking

exports.DeleteAllBooking = async (req, res) => {
    try {
        const deleteBookings = await Booking.deleteMany();
        return res.status(200).json({ status: 'Success', message: 'All bookings deleted successfully', data: deleteBookings, count: deleteBookings.deletedCount });
    } catch (error) {
        return res.status(500).json({ status: 'Error', message: 'Failed to delete bookings', error: error.message });
    }
};

