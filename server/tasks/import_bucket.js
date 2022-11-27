let CsvTask = require('./CsvTask.js');
let Bucket = require('../models/bucket.js');

class MyTask extends CsvTask {

	async run() {

		let filename = 'buckets.csv';
		
		let new_items = await this.read_csv( filename );
		console.log('Read %d records from %s', new_items.length, filename);

		let stats = { inserted: 0, errors: 0 };
		for( let i=0; i<new_items.length; i++) {
			let r = new_items[i];
			let b = {
				id: r.id,
				name: r.name,
				inferred_status: r.status
			};

			try {
				await Bucket.create(b);
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