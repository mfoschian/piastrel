let ConvocationConfirmPdf = require('./ConvocationConfirmPdf.js');

class BucketConfirmPdf extends ConvocationConfirmPdf {

	constructor(filename, options) {
		let opts = Object.assign({}, options);
		opts.bucket_page = false;
		super(filename, opts);
	}

	render( params ) {

		let bucket = params.bucket;
		let event = params.event;
		let convocations = params.convocations;
		if( !bucket || !event || !convocations ) {
			console.error('Wrong parameters for render BucketConfirmPdf');
			return;
		}

		for( let i=0; i<convocations.length; i++ ) {
			if( i > 0 )
				this.doc.addPage();

			let c = convocations[i];
			let pms = {
				convocation: c.convocation,
				person: c.person,
				contacts: c.contacts,
				bucket,
				event,
				buckets: []
			};
			console.log('Adding page for %s', (c.person.last_name + ' ' + c.person.first_name).toUpperCase() );
			super.render( pms );
		}
	}
}

module.exports = BucketConfirmPdf;