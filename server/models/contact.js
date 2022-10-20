let BaseModel = require( './BaseModel.js' );


class Contact extends BaseModel {

	static table_name = 'contacts';
	static upd_fields = ['person_id','type','value'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static of(person_id) {
		return this.db().select().from(this.table_name).where( { person_id: person_id } );
	}

}

module.exports = Contact;