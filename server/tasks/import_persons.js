let CsvTask = require('./CsvTask.js');
let Person = require('../models/person.js');

class MyTask extends CsvTask {

	async run() {

		let filename = 'persons.csv';
		
		let new_items = await this.read_csv( filename );
		console.log('Read %d records from %s', new_items.length, filename);

		let stats = { inserted: 0, errors: 0 };
		for( let i=0; i<new_items.length; i++) {
			let r = new_items[i];
			let p = {
				first_name: r.first_name,
				last_name: r.last_name,
				code: r.code,
				note: r.note
			};


			try {
				await Person.create(p);
				stats.inserted++;
			}
			catch( err ) {
				console.error( err );
				stats.errors++;
			}
		}

		console.log( 'Done. Inserted: %d, errors: %d', stats.inserted, stats.errors);

	}

}


MyTask.run();