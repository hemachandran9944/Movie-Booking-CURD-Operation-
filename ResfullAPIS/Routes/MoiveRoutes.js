const express = require('express');
const router = express.Router();
const MovieController = require('../Controllers/MovieController');
const { upload } = require('../config/cloudinary');
const { AuthorizationTokenVerify} = require('../Setting/Autho');


router.post('/movies', upload.single('PosterImage'), MovieController.MovieCreate);
router.get('/getmovie/:id', AuthorizationTokenVerify, MovieController.GetSingleMovie);
router.get('/getallmovies', MovieController.GetAllMovies);
router.put('/updatemovie/:id', AuthorizationTokenVerify, upload.single('PosterImage'), MovieController.UpdateMovies);
router.delete('/deletesinglemovie/:id', AuthorizationTokenVerify, MovieController.DeleteSingleMovie);
router.delete('/deleteallmovies', MovieController.DeleteAllMovies);


module.exports = router;