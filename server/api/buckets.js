const express = require('express');
let router = express.Router();

let Bucket = require('../models/bucket.js')


router.get('/', async function (req, res) {
	let items = await Bucket.all();
	res.json({items});
});

router.get('/:id', async function (req, res) {
	let item = await Bucket.get(req.params.id);
	if (item != null) {
		res.json( item )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

router.post('/', async function (req, res) {
	let name = req.body.name;
	let inf_status = req.body.inferred_status;

	if (!name) {
		res.status(400);
		res.json({ message: "Bad Request" });
	}
	else {
		let p = await Bucket.create( req.body );
		res.json({ message: "New Bucket created.", new_id: p.id });
	}
});

router.put('/:id', async function (req, res) {
	let p = await Bucket.get(req.params.id);
	if(!p) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else {
		let pp = await Bucket.update( req.body, p.id );
		if( !pp ) {
			res.status(404);
			res.json({ message: "Not Found" });				
		}
		else
			res.json({success: true, item: pp });
	}
});

router.delete('/:id', function (req, res) {

	let ok = Bucket.del(req.params.id);
	if(!ok) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else
		res.send({success: true});
});


module.exports = router;