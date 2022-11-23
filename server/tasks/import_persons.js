let BaseTask = require('./BaseTask.js');
let Person = require('../models/person.js');

class MyTask extends BaseTask {


	async read_csv(filename) {
		const fs = require("fs");
		const csvParser = require("csv-parser");

		const result = [];

		fs.createReadStream( filename )
			.pipe(csvParser())
			.on("data", (data) => {
				result.push(data);
			})
			.on("end", () => {
				console.log(result);
			});
	}

	async run() {

		let items = await Person.all();
		console.table(items);
		
		let new_items = await this.read_csv( 'test.csv' );
		console.table(new_items);

	}

}


MyTask.run();