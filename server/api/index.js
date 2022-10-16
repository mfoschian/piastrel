const express = require('express');
let router = express.Router();

const persons = require('./persons.js');
const events = require('./events.js');

router.use('/persons', persons);
router.use('/events', events);

module.exports = router;