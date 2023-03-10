const { stringify } = require("csv-stringify");



class BaseCsv {

	constructor( filename, columns ) {
		this.filename = filename || null;
		this.stringifier = stringify({ header: true, columns: columns });
	}

	send(req, res) {
		let filename = this.filename || req.body.filename || 'report.csv';
		// Stripping special characters
		filename = encodeURIComponent(filename);
		if( !filename.toLowerCase().endsWith('.csv') )
			filename += '.csv';

		// Setting response to 'attachment' (download).
		res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
		res.setHeader('Content-type', 'text/csv');
		this.stringifier.pipe(res);
	}

	render(objects) {
		if( !objects )
			return;
	
		for( let i=0; i<objects.length; i++ ) {
			let obj = objects[i];
			if( obj != null )
				this.stringifier.write( obj );
		}
		this.stringifier.end();
	}

	tryRender( args ) {
		try {
			this.render(args);
			return true;
		}
		catch( err ) {
			console.error( err );
			return false;
		}
	}

}

module.exports = BaseCsv;