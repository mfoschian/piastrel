let BaseModel = require( './BaseModel.js' );


class Contact extends BaseModel {

	static table_name = 'contacts';
	static upd_fields = ['person_id','type','value'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static of(person_id) {
		return this.db().select().from(this.table_name).where( { person_id: person_id } );
	}

	static async upsert(person_id, type, value) {
		let records = await this.db().select().from(this.table_name).where( { person_id: person_id, type: type } )
		.then( results => results.map( r => this.db_to_model(r) ) );
		let r = records[0];
		if( r == null ) {
			// insert
			return this.create( {person_id: person_id, type: type, value: value } );
		}
		else {
			// update
			return this.db()(this.table_name).where({ id: r.id }).update( this.model_to_db({type: type, value: value }) );
		}
	}

}

module.exports = Contact;