const express = require('express');

const router = express.Router();


router.use('/users',require('./users'));
router.use('/tweets',require('./tweets'));

module.exports = router;