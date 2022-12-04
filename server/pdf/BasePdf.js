const PDFDocument = require('pdfkit');

class BasePdf {

	constructor( filename ) {
		this.doc = new PDFDocument();
		this.filename = filename || null;
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
}

module.exports = BasePdf;