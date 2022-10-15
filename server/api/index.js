const express = require('express');
let router = express.Router();

const persons = require('./persons.js');

router.use('/persons', persons);

module.exports = router;