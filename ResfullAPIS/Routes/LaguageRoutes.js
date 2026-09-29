const express = require('express');
const router = express.Router();
const laguageController = require('../Controllers/LaguageController');


router.get('/getlanguage', laguageController.GetLanguage);

module.exports = router;

