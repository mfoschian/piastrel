const express = require('express');
const Contact = require('../models/contact.js');
const Event = require('../models/event.js');
const Bucket = require('../models/bucket.js');
const Person = require('../models/person.js');
let router = express.Router();

let Convocation = require('../models/convocation.js');
let ConvConfirmPdf = require('../pdf/ConvocationConfirmPdf.js');


router.get('/', async function (req, res) {
	let items = [];
	if( req.query.event != null ) {
		console.log('reading convocations of event %s', req.query.event);
		items = await Convocation.of_event( req.query.event );
	}
	else
		items = await Convocation.all();
	res.json({items});
});

router.get('/:id', async function (req, res) {
	let item = await Convocation.get(req.params.id);
	if (item != null) {
		res.json( item )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

router.get('/:id/confirmation.pdf', async function (req, res) {
	let conv = await Convocation.get(req.params.id);
	if (conv == null) {
		res.status(404);
		res.json({ message: "Not Found" });
		return;
	}

	let bucket = await Bucket.get(conv.bucket_id);
	if (bucket == null) {
		res.status(404);
		res.json({ message: "Not Found" });
		return;
	}

	let event = await Event.get(conv.event_id);
	if (event == null) {
		res.status(404);
		res.json({ message: "Not Found" });
		return;
	}

	let person = await Person.get(conv.person_id);
	if (person == null) {
		res.status(404);
		res.json({ message: "Not Found" });
		return;
	}

	let cts = await Contact.of(person.id);
	let contacts = {};
	for(let i=0; i<cts.length; i++) {
		let c = cts[i];
		contacts[ c.type ] = c.value;
	}

	let params = {
		convocation: conv,
		person,
		contacts,
		bucket,
		event
	};
	let filename = 'convoc_' + conv.code + '.pdf';
	let pdf = new ConvConfirmPdf(filename);
	let ok = pdf.tryRender(params);
	if(!ok) console.error( 'ERROR creating Confirmation pdf' );
	pdf.send(req, res);
});

router.post('/', async function (req, res) {
	let person_id = req.body.person_id;
	let event_id = req.body.event_id;
	// let bucket_id = req.body.bucket_id;

	// if (!person_id || !event_id || !bucket_id) {
	if (!person_id || !event_id) {
		res.status(400);
		res.json({ message: "Bad Request" });
	}
	else {
		let p = await Convocation.create( req.body );
		res.json({ message: "New Convocation created.", new_id: p.id });
	}
});

router.put('/:id', async function (req, res) {
	let p = await Convocation.get(req.params.id);
	if(!p) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else {
		let pp = await Convocation.update( req.body, p.id );
		pp = await Convocation.get(p.id);
		if( !pp ) {
			res.status(404);
			res.json({ message: "Not Found" });				
		}
		else
			res.json({success: true, item: pp });
	}
});

router.delete('/:id', function (req, res) {

	let ok = Convocation.del(req.params.id);
	if(!ok) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else
		res.send({success: true});
});


module.exports = router;