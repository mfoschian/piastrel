const express = require('express');
let router = express.Router();

let Event = require('../models/event.js')


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


module.exports = router;