let BaseModel = require( './BaseModel.js' );


class Convocation extends BaseModel {


	static table_name = 'convocations';
	static upd_fields = ['person_id','event_id','bucket_id','status','note'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static join_fields = ['c.*','p.last_name as last_name', 'p.first_name as first_name', 'p.code as code', 'p.note as note'];
	static all() {
		// console.log('Selecting all from %s', this.table_name);
		return this.db()
			.select(this.join_fields)
			.from(this.table_name + ' as c')
			.join('persons as p', 'p.id', 'c.person_id')
			.then( results => results.map( r => this.db_to_model(r) ) );
	}

	static of_event(event_id) {
		// console.log('Selecting all from %s', this.table_name);
		return this.db()
			.select(this.join_fields).from(this.table_name + ' as c')
			.join('persons as p', 'p.id', 'c.person_id')
			.where( {'c.event_id': event_id })
			.then( results => results.map( r => this.db_to_model(r) ) )
			;
		// console.log( s.toSQL() );
	}

	static get(id) {
		return this.db()
			.select(this.join_fields).from(this.table_name +' as c')
			.join('persons as p', 'p.id', 'c.person_id')
			.where( { 'c.id': id } )
			.then( results => {
				if( results )
					return this.db_to_model(results[0]);
				else return null;
			});
	}


}

module.exports = Convocation;