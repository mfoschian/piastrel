let DB = require( '../db' );

class BaseModel {
	
	static table_name = 'events';
	static upd_fields = [];
	static ups_fields = ['id'];

	static map_fields( record ) {
		return record;
	}

	static debug( sql ) {
		console.log( sql.toSQL().toNative() );
	}

	static parse_dt = DB.parse_dt;

	static db() {
		return DB.me();
	}

	static table() {
		return DB.me().table(this.table_name);
	}

	static table_as(alias) {
		return DB.me().table(this.table_name + ' as ' + alias);
	}

	static all() {
		// console.log('Selecting all from %s', this.table_name);
		return DB.me().select().from(this.table_name)
		.then( results => results.map( r => this.map_fields(r) ) );
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
		return DB.me()(this.table_name).insert( p )
			.then( res => {
				if( Array.isArray(res) ) {
					let id = res[0];
					return {id};
				}
				else
					return res;
			});
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
		// values = this.map_fields(values);

		return DB.me()(this.table_name).where({ id: id || p.id }).update( values );
	}

	static upsert(p) {
		return DB.upsert( this.table_name, p, this.ups_fields );
	}
}

module.exports = BaseModel;