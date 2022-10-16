let DB = require( '../db' );

const table_name = 'persons';
const upd_fields = ['first_name','last_name','code','note'];
const ups_fields = ['id'].concat(upd_fields);

let Person = {
	all() {
		return DB.me().select().from(table_name);
	},
	get(id) {
		return DB.me().select().from(table_name).where( { id: id } )
		.then( results => {
			if( results )
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
		return DB.me()(table_name).where({ id: id || p.id }).update( values )
	},
	upsert(p) {
		return DB.upsert( table_name, p, ups_fields );
	}
}

module.exports = Person;