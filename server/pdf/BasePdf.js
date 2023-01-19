const PDFDocument = require('pdfkit');

const SIZES = {
	'A3': { inc: { x: 11.7, y: 16.5 }, cm: { x: 29.7, y: 42 } },
	'A4': { inc: { x: 8.3, y: 11.7 }, cm: { x: 21, y: 29.7 } },
	'LETTER': { inc: { x: 8.5, y: 11 }, cm: { x: 21.6, y: 27.95 } }
};
const PT_X_INC = 72;


class BasePdf {

	static ptXcm( pageSize ) {
		const def_size = 'LETTER';
		let size = SIZES[(pageSize||def_size).toUpperCase()];
		if( !size ) size = SIZES[def_size];

		let inc = size.inc;
		let cm = size.cm;

		return {
			x: PT_X_INC * inc.x / cm.x,
			y: PT_X_INC * inc.y / cm.y
		};
	}

	constructor( filename, args ) {
		this.doc = new PDFDocument(args);
		this.filename = filename || null;

		const _assets = __dirname + '/../assets';
		this.assets = {
			font: (f) => _assets + '/fonts/' + f,
			image: (f) => _assets + '/images/' + f
		};
	}

	addFont( name, url, family ) {
		this.doc.registerFont( name, url, family );
	}

	send(req, res) {
		let filename = this.filename || req.body.filename;
		// Stripping special characters
		filename = encodeURIComponent(filename);
		if( !filename.toLowerCase().endsWith('.pdf') )
			filename += '.pdf';
		// Setting response to 'attachment' (download).
		// If you use 'inline' here it will automatically open the PDF
		res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
		res.setHeader('Content-type', 'application/pdf');
		this.doc.pipe(res);
		this.doc.end();
	}

	render() { }

	tryRender( args ) {
		try {
			this.render(args);
			return true;
		}
		catch( err ) {
			this.doc.moveTo(0,0);
			this.doc.text( err.toString() );
			return false;
		}
	}
}

module.exports = BasePdf;