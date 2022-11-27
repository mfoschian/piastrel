let BaseTask = require('./BaseTask.js');

class CsvTask extends BaseTask {


	async read_csv(filename) {
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

}


module.exports = CsvTask;