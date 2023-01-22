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

	addTable( columns, options ) {
		return new Table( this.doc, columns, options );
	}
}

class Table {

	constructor( doc, columns, options ) {
		this.doc = doc;
		this.columns = columns;
		this.options = options || {};
	}

	draw_row( x, y, texts, opts ) {
		let doc = this.doc;
		const o = Object.assign( {}, this.options.style || {}, opts || {} );
		const padding = o.padding || {};
		const padding_x = padding.x || 0;
		const padding_y = padding.y || 0;

		doc.save();
		const border = o.border || {};
		if( border.color != null ) doc.strokeColor( border.color );
		if( border.width != null ) doc.lineWidth( border.width );

		const font = o.font || {};
		if( font.name != null ) doc.font( font.name );
		if( font.size != null ) doc.fontSize( font.size );

		let max_h = 0;
		// calculate max text height
		for( let i=0; i<texts.length; i++ ) {
			let text = texts[i];
			const col = this.columns[i];
			let width = col.width - (2 * padding_x);
			doc.save();
			let old_font_name, old_font_size;
			if( col.font ) {
				old_font_name = doc._font.name;
				old_font_size = doc._font.size;
				if( col.font.name ) doc.font( col.font.name );
				if( col.font.size ) doc.fontSize( col.font.size );
			}
			const align = col.align == null ? 'left' : col.align;
			let _h = doc.heightOfString( text, { align: align, width: width });
			if( old_font_name ) doc.font( old_font_name );
			if( old_font_size ) doc.fontSize( old_font_size );
			doc.restore();
			if( _h > max_h )
				max_h = _h;
		}

		// draw cells and bounding boxes
		let _x = x;
		let _y = y + padding_y;
		let _h = max_h + 2 * padding_y;

		for( let i=0; i<texts.length; i++ ) {
			let col = this.columns[i];
			let _w = col.width;
			let text = texts[i];
			let w = _w - (2 * padding_x);

			doc.save();
			let old_font_name, old_font_size;
			if( col.font ) {
				old_font_name = doc._font.name;
				old_font_size = doc._font.size;
				if( col.font.name ) doc.font( col.font.name );
				if( col.font.size ) doc.fontSize( col.font.size );
			}
			const align = col.align == null ? 'left' : col.align;			
			doc.text( text, _x + padding_x, _y , {
				align: align,
				width: w,
				height: max_h
			});
			if( old_font_name ) doc.font( old_font_name );
			if( old_font_size ) doc.fontSize( old_font_size );
			doc.restore();
			doc.rect( _x, y, _w, _h ).stroke();
			_x += _w;
		}
		
		doc.restore();

		return  (y + _h);
	};

	draw_headers( x, y, style ) {
		let h_style = Object.assign( {}, this.options.style || {}, this.options.headers_style || {}, style || {} );

		return this.draw_row( x, y, this.columns.map( c => c.label ), h_style );
	}

	draw( x, y, rows ) {
		let _y = this.draw_headers( x, y );
		if( Array.isArray(rows) ) {
			for( let i=0; i<rows.length; i++ ) {
				let cols = rows[i];
				_y = this.draw_row( x, _y, cols );
			}
		}
		else if( typeof(rows) == 'function' ) {
			let ix = 0;
			let cols = rows(ix++);
			while( Array.isArray(cols) ) {
				_y = this.draw_row( x, _y, cols );
				cols = rows(ix++);
			}
		}
		return _y;
	}
}

module.exports = BasePdf;