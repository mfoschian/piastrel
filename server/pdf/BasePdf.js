const PDFDocument = require('pdfkit');

class BasePdf {

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