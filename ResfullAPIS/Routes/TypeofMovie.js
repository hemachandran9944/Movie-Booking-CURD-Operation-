
const express = require('express');
const router = express.Router();

const TypeOfMovieController = require('../Controllers/TypeofMovieController');

router.get('/getmovietype', TypeOfMovieController.GetMovieType);

module.exports = router;