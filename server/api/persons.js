const express = require('express');
let router = express.Router();

let Person = require('../models/person.js')


router.get('/', function (req, res) {
	let items = Person.all();
	res.json({items});
});

router.get('/:id', function (req, res) {
	let item = Person.get(req.params.id);
	if (item != null) {
		res.json( item )
	} else {
		res.status(404);
		res.json({ message: "Not Found" });
	}
});

router.post('/', function (req, res) {
	let fn = req.body.first_name;
	let ln = req.body.last_name;
	let code = req.body.code;

	if (!fn || !ln || !code ) {
		res.status(400);
		res.json({ message: "Bad Request" });
	}
	else {
		let p = Person.create( {
			first_name: fn,
			last_name: ln,
			code: code
		});
		res.json({ message: "New movie created.", new_id: p.id });
	}
});

router.put('/:id', function (req, res) {
	let p = Person.get(req.params.id);
	if(!p) {
		res.status(404);
		res.json({ message: "Not Found" });
	}
	else {
		let p = {};
		["first_name", "last_name", "code" ].map( k => {
			let v = req.body[k];
			if( !( v == null || typeof(v) == 'undefined') )
				p[k] = req.body[k];
		});

		let pp = Person.update( req.params.id, p );
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