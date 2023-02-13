let Person = require('../models/person.js');
let Convocation = require('../models/convocation.js');


async function read_csv(filename) {
	const fs = require("fs");
	const csvParser = require("csv-parser");

	const result = [];

	return new Promise( (resolve,reject) => {
	fs.createReadStream( filename )
		.pipe(csvParser())
		.on("data", (data) => {
			result.push(data);
		})
		.on("end", () => {
			// console.log(result);
			resolve( result );
		});
	});
}

async function import_persons(filename, event_id) {

	let new_items = await read_csv(filename);
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
		let c = await Convocation.find( event_id, p.id );
		if( c == null || c.length == 0 ) {
			// Person is not convocated: insert
			const c = {
				event_id: event_id,
				person_id: p.id,
				bucket_id: null,
				status: 'convocated'
			};
			await Convocation.create(c);
		}

		// Update contacts

	}

	console.log('Done. Inserted: %d, errors: %d', stats.inserted, stats.errors);
	return stats;

}

module.exports = import_persons;