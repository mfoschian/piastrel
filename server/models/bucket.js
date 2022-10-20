let DB = require( '../db' );

const table_name = 'bucket';
const upd_fields = ['name','inferred_status'];
const ups_fields = ['id'].concat(upd_fields);

// function map_fields( record ) {
// 	if(!record) return null;

// 	if( record['date'] ) {
// 		record['date'] = DB.parse_dt(record['date']);
// 	}
// 	return record;
// }

let Bucket = {
	all() {
		return DB.me().select().from(table_name);
	},
	get(id) {
		return DB.me().select().from(table_name).where( { id: id } )
		.then( results => {
			if( results )
				// return map_fields(results[0]);
				return results[0];
			else return null;
		});
	},
	del(id) {
		return DB.me()(table_name).where( { id: id } ).del();
	},
	create(p) {
		return DB.me()(table_name).insert( p );
	},
	update(p, id) {
		let values = {};
		upd_fields.forEach( f => {
			if( p[f] !== undefined )
				values[f] = p[f];
		});

		if( Object.keys(values).length == 0 ) {
			return this.get(id);
		}
		values = map_fields(values);

		return DB.me()(table_name).where({ id: id || p.id }).update( values )
	},
	upsert(p) {
		return DB.upsert( table_name, p, ups_fields );
	}
}

module.exports = Bucket;