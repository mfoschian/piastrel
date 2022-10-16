let _knex = null;

async function init(options) {
	if( _knex != null ) return;

	let opts = options || {};

	_knex = require('knex')( opts );
}

function parse_dt(v) {
	if( !v ) return v;

	const t = typeof(v);
	if( t == 'number' ) {
		let dt = new Date();
		dt.setTime(v);
		return dt;
	}

	if( t == 'string' ) {
		const ms = Date.parse(v);
		let dt = new Date();
		dt.setTime(ms);
		return dt;
	}

	return v;
}


async function upsert( table, item, fields ) {
		
	if( !item )
		return Promise.resolve();

	return _knex.transaction( async function(trx) {

		let items = Array.isArray( item ) ? item : [ item ];

		try {
			for( let i=0; i<items.length; i++ ) {

				let values = items[i];
				let record = {};
				let upd_record = {};

				fields.forEach( key => {
					let v = values[key];
					if( v !== undefined ) {
						record[key] = value;
						if( key != "id" )
							upd_record[key] = value;
					}
				})


				await _knex(table).insert(record)
				.onConflict('id').merge(upd_record)
				.transacting(trx);
			}

			// trx.commit();
		}
		catch( err ) {
			// trx.rollback(err);
			throw err;
		}

	});

}

module.exports = {
	init,
	me() { return _knex },
	upsert,
	parse_dt
};