let BaseModel = require( './BaseModel.js' );


class Convocation extends BaseModel {


	static table_name = 'convocations';
	static upd_fields = ['person_id','event_id','bucket_id','status','note','doc_dt','doc_number'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static join_fields = ['c.*','p.last_name as last_name', 'p.first_name as first_name', 'p.code as code']; //, 'p.note as note'];

	// static model_to_db(record) {
	// 	return record;
	// }

	static db_to_model(record) {
		if (!record) return null;

		if (record['doc_dt']) {
			record['doc_dt'] = this.parse_dt(record['doc_dt']);
		}

		return record;
	}


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

	static of_event_detailed(event_id) {
		// console.log('Selecting all from %s', this.table_name);
		const fields = [
			'b.number as bucket_nr', 'b.name as bucket_name',
			'p.last_name as last_name', 'p.first_name as first_name', 'p.code as code',
			'c.status as status', 'c.note as note',
			'r.value as phone'
		];

		return this.db()
			.select(fields).from(this.table_name + ' as c')
			.join('persons as p', 'p.id', 'c.person_id')
			.leftOuterJoin('buckets as b', 'b.id', 'c.bucket_id')
			.leftOuterJoin('contacts as r', function() {
				this
					.on('r.person_id', '=', 'c.person_id')
					.andOnVal('r.type','=','phone');
			})
			.where( {'c.event_id': event_id })
			.orderBy(['bucket_nr', 'first_name', 'last_name'])
			//.then( results => results.map( r => this.db_to_model(r) ) )
			;
	}

	static pid_of_event_bucket(event_id, bucket_id) {
		// console.log('Selecting all from %s', this.table_name);
		return this.db()
			.select(['id', 'person_id']).from(this.table_name)
			.where( {event_id: event_id, bucket_id: bucket_id })
			// .then( results => results.map( r => this.db_to_model(r) ) )
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

	static find(event_id, person_id) {
		// console.log('Selecting all from %s', this.table_name);
		return this.db()
			.select(this.join_fields).from(this.table_name + ' as c')
			.join('persons as p', 'p.id', 'c.person_id')
			.where( {'c.event_id': event_id, 'c.person_id': person_id })
			.then( results => results.map( r => this.db_to_model(r) ) )
			;
		// console.log( s.toSQL() );
	}
}

module.exports = Convocation;