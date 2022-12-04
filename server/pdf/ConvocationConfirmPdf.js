let BasePdf = require('./BasePdf.js');

class ConvocationConfirmPdf extends BasePdf {

	constructor(filename) {
		super(filename);
	}

	render( conv ) {
		const doc = this.doc;

		doc.fontSize(25).text('Conferma Scrutatore', 100, 80);
		doc.moveDown();
		doc.text(`Cognome: ${conv.last_name}`)
			// .moveDown()
			.text(`Nome: ${conv.first_name}`)
			.text(`Codice Fiscale: ${conv.code}`)
		;

	}

}

module.exports = ConvocationConfirmPdf;