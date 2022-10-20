let DB = require( '../db' );

class BaseModel {
	
	static table_name = 'events';
	static upd_fields = [];
	static ups_fields = ['id'];

	static map_fields( record ) {
		return record;
	}

	static db() {
		return DB.me();
	}

	static all() {
		return DB.me().select().from(this.table_name);
	}

	static get(id) {
		return DB.me().select().from(this.table_name).where( { id: id } )
		.then( results => {
			if( results )
				return this.map_fields(results[0]);
			else return null;
		});
	}

	static del(id) {
		return DB.me()(this.table_name).where( { id: id } ).del();
	}
	
	static create(p) {
		return DB.me()(this.table_name).insert( p );
	}

	static update(p, id) {
		let values = {};
		this.upd_fields.forEach( f => {
			if( p[f] !== undefined )
				values[f] = p[f];
		});

		if( Object.keys(values).length == 0 ) {
			return this.get(id);
		}
		values = this.map_fields(values);

		return DB.me()(this.table_name).where({ id: id || p.id }).update( values )
	}

	static upsert(p) {
		return DB.upsert( this.table_name, p, this.ups_fields );
	}
}

module.exports = BaseModel;