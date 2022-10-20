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
		res.json({ message: "New person created.", new_id: p.id });
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



contact_router = express.Router({mergeParams: true});
let Contact = require('../models/contact.js');

contact_router.get('/', async function (req, res) {
	let person_id = req.params.id;
	let items = await Contact.of(person_id);
	res.json({items});
});

contact_router.get('/:cid', async function (req, res) {
	let item = await Contact.get(req.params.cid);
	if (item != null) {
		res.json( item )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

contact_router.post('/', async function (req, res) {
	let typ = req.body.type;
	let val = req.body.value;
	let person_id = req.params.id;

	if (!typ || !person_id ) {
		res.status(400);
		res.json({ message: "Bad Request" });
	}
	else {
		let p = await Contact.create( { preson_id, type: typ, value: val } );
		res.json({ message: "New contact created.", new_id: p.id });
	}
});

contact_router.put('/:cid', async function (req, res) {
	let p = await Contact.get(req.params.cid);
	if(!p || p.person_id != req.params.id) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else {
		let pp = await Contact.update( {
			id: p.id,
			person_id: p.person_id,
			type: req.body.type,
			value: req.body.value
		}, p.id );
		if( !pp ) {
			res.status(404);
			res.json({ message: "Not Found" });				
		}
		else
			res.json({success: true, item: pp });
	}
});

contact_router.delete('/:cid', async function (req, res) {

	let p = await Contact.get(req.params.cid);
	let ok = (p && p.person_id == req.params.id);
	if( ok )
		ok = Contact.del(req.params.cid);

	if(!ok) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else
		res.send({success: true});
});

router.use('/:id/contacts', contact_router);

module.exports = router;