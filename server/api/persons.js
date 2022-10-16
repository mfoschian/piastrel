const express = require('express');
let router = express.Router();

let Person = require('../models/person.js')


router.get('/', async function (req, res) {
	let items = await Person.all();
	res.json({items});
});

router.get('/:id', async function (req, res) {
	let item = await Person.get(req.params.id);
	if (item != null) {
		res.json( item )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

router.post('/', async function (req, res) {
	let fn = req.body.first_name;
	let ln = req.body.last_name;
	let code = req.body.code;

	if (!fn || !ln || !code ) {
		res.status(400);
		res.json({ message: "Bad Request" });
	}
	else {
		let p = await Person.create( req.body );
		res.json({ message: "New movie created.", new_id: p.id });
	}
});

router.put('/:id', async function (req, res) {
	let p = await Person.get(req.params.id);
	if(!p) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else {
		let pp = await Person.update( req.body, p.id );
		if( !pp ) {
			res.status(404);
			res.json({ message: "Not Found" });				
		}
		else
			res.json({success: true, item: pp });
	}
});

router.delete('/:id', function (req, res) {

	let ok = Person.del(req.params.id);
	if(!ok) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else
		res.send({success: true});
});


module.exports = router;