const express = require('express');
let router = express.Router();

const persons = require('./persons.js');
const events = require('./events.js');
const buckets = require('./buckets.js');
const convocations = require('./convocations.js');

router.use('/persons', persons);
router.use('/events', events);
router.use('/buckets', buckets);
router.use('/convocations', convocations);

module.exports = router;