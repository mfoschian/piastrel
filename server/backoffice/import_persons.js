let Person = require('../models/person.js');
let Convocation = require('../models/convocation.js');
let Contact = require('../models/contact.js');

const trimmed = require('../lib/utils.js').trimmed;

async function read_csv(filename, options) {
	const fs = require("fs");
	const csvParser = require("csv-parser");

	const result = [];

	return new Promise( (resolve,reject) => {
	fs.createReadStream( filename )
		.pipe(csvParser(options))
		.on("data", (data) => {
			result.push(data);
		})
		.on("end", () => {
			// console.log(result);
			resolve( result );
		});
	});
}

async function import_persons(filename, event_id, options) {

	let new_items = await read_csv(filename, options);
	console.log('Read %d records from %s', new_items.length, filename);

	let stats = { inserted: 0, errors: 0 };
	for (let i = 0; i < new_items.length; i++) {
		let r = new_items[i];

		let p = null;
		if( r.code != null && r.code != '' )  {
			p = await Person.find_by_code(r.code);
			if( Array.isArray(p) )
				p = p[0];
		}

		if( p == null ) {
			// New person
			p = {
				first_name: r.first_name,
				last_name: r.last_name,
				code: r.code,
				note: r.note
			};


			try {
				p = await Person.create(p);
				stats.inserted++;
			}
			catch (err) {
				console.error(err);
				stats.errors++;
				continue;
			}
		}
	
		// Insert Person in convocations
		let cc = await Convocation.find( event_id, p.id );
		if( cc == null || cc.length == 0 ) {
			// Person is not convocated: insert
			const c = {
				event_id: event_id,
				person_id: p.id,
				bucket_id: null,
				status: 'convocated',
				note: r.note
			};
			await Convocation.create(c);
		}
		else {
			// Update note field on person convocation, if given
			let c = cc[0];
			const rn = trimmed(r.note);
			const cn = trimmed(c.note);
			if( rn && (!cn || cn != rn) ) {
				try {
					await Convocation.update( {note: r.note}, c.id );
				}
				catch( err ) {
					console.error(err);
				}
			}
		}

		// Update contacts
		const known_contacts = ['phone','address','cap','municipality'];
		const given_contacts = known_contacts
			.map( c => ({
				type: c,
				value: trimmed(r[c])
			}))
			.filter( c => c.value != null );

		for( let i=0; i < given_contacts.length; i++ ) {
			let c = given_contacts[i];
			try {
				await Contact.upsert( p.id, c.type, c.value );
			}
			catch( err ) {
				console.error(err);
			}
		}
	}

	console.log('Done. Inserted: %d, errors: %d', stats.inserted, stats.errors);
	return stats;

}

module.exports = import_persons;