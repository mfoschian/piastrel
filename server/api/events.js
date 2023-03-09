const express = require('express');
let router = express.Router();

let Event = require('../models/event.js');
let Bucket = require('../models/bucket.js');
let Person = require('../models/person.js');
let Contact = require('../models/contact.js');
const Convocation = require('../models/convocation.js');

let BucketConfirmPdf = require('../pdf/BucketConfirmPdf.js');


router.get('/', async function (req, res) {
	let items = await Event.all();
	res.json({items});
});

router.get('/active', async function (req, res) {
	let items = await Event.get_active();
	if (items != null && items.length > 0 ) {
		res.json( items[0] )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

router.get('/:id', async function (req, res) {
	let item = await Event.get(req.params.id);
	if (item != null) {
		res.json( item )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

router.get('/:id/buckets/:bid/confirmations.pdf', async function (req, res) {

	let event = await Event.get(req.params.id);
	if (event == null) {
		res.status(404);
		res.json({ message: "Not Found" });
		return;
	}

	let bucket = await Bucket.get(req.params.bid);
	if (bucket == null) {
		res.status(404);
		res.json({ message: "Not Found" });
		return;
	}

	let convs = await Convocation.pid_of_event_bucket( event.id, bucket.id );

	let status = req.query.status || 'confirmed';
	if(status == 'all')
		status = null;
	else
		status = status.split(',');

	

	let convocations = [];
	for( let i=0; i<convs.length; i++ ) {
		let c = convs[i];

		let conv = await Convocation.get( c.id );
		if(status != null && status.indexOf(conv.status) < 0 )
			continue;

		let person = await Person.get( c.person_id );

		let cts = await Contact.of(person.id);
		let contacts = {};
		for(let i=0; i<cts.length; i++) {
			let c = cts[i];
			contacts[ c.type ] = c.value;
		}

		convocations.push({
			person,
			contacts,
			convocation: conv
		});
	}

	let params = {
		bucket,
		event,
		convocations
	};

	let filename = 'section_' + bucket.number + '_convocations.pdf';
	let pdf = new BucketConfirmPdf(filename);
	let ok = pdf.tryRender(params);
	if(!ok) console.error( 'ERROR creating Bucket Confirmation pdf' );
	pdf.send(req, res);
});

router.post('/', async function (req, res) {
	let title = req.body.title;
	let date = req.body.date;

	if (!title || !date ) {
		res.status(400);
		res.json({ message: "Bad Request" });
	}
	else {
		let ev = await Event.create( req.body );
		res.json({ message: "New event created.", new_id: ev.id });
	}
});

router.put('/:id', async function (req, res) {
	let p = await Event.get(req.params.id);
	if(!p) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else {
		let pp = await Event.update( req.body, p.id );
		pp = await Event.get(req.params.id);
		if( !pp ) {
			res.status(404);
			res.json({ message: "Not Found" });				
		}
		else
			res.json({success: true, item: pp });
	}
});

router.delete('/:id', async function (req, res) {

	let ok = await Event.del(req.params.id);
	if(!ok) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else
		res.send({success: true});
});

const upload = require('../backoffice/upload.js');
router.use('/:id/upload',upload);


module.exports = router;