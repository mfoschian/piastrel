let db = require('../db');
let options = require('../options.js')

class BaseTask {

	static async initDB() {
		console.log( 'Connecting to database...' );
		await db.init(options.database);	
	}

	static async closeDB() {
		console.log( 'Closing database...' );
		await db.close();	
	}

	static async run(options) {
		let opts = options || {
			init_db: true
		};

		if( opts.init_db ) {
			await BaseTask.initDB();
		}

		try {
			let task_class = this;
			let t = new task_class();
			await t.run();
		}
		catch( err ) {
			console.error( err );
		}

		if( opts.init_db ) {
			await BaseTask.closeDB();
		}

	}
}

module.exports = BaseTask;