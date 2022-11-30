let BaseModel = require( './BaseModel.js' );


class Convocation extends BaseModel {


	static table_name = 'convocations';
	static upd_fields = ['person_id','event_id','bucket_id','status','note'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static all() {
		// console.log('Selecting all from %s', this.table_name);
		return this.db()
			.select().from(this.table_name + ' as c')
			.join('persons', 'persons.id', 'c.person_id')
			.then( results => results.map( r => this.map_fields(r) ) );
	}

	static get(id) {
		return this.db()
			.select().from(this.table_name +' as c')
			.join('persons', 'persons.id', 'c.person_id')
			.where( { 'c.id': id } )
			.then( results => {
				if( results )
					return this.map_fields(results[0]);
				else return null;
			});
	}


}

module.exports = Convocation;