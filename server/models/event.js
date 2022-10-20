let BaseModel = require('./BaseModel.js');

class Event extends BaseModel {

	static table_name = 'events';
	static upd_fields = ['title', 'date', 'active'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static map_fields(record) {
		if (!record) return null;

		if (record['date']) {
			record['date'] = DB.parse_dt(record['date']);
		}
		return record;
	}

}

module.exports = Event;