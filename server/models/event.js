let BaseModel = require('./BaseModel.js');

class Event extends BaseModel {

	static table_name = 'events';
	static upd_fields = ['title', 'date', 'active'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static map_fields(record) {
		if (!record) return null;

		if (record['date']) {
			record['date'] = this.parse_dt(record['date']);
		}
		return record;
	}

	static get_active() {
		let sql = this.table().where( { active: true } );
		// this.debug( sql );
		return sql.then( results => results.map(x => this.map_fields(x)) );
	}
}

module.exports = Event;