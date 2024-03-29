let BaseModel = require('./BaseModel.js');

class Event extends BaseModel {

	static table_name = 'events';
	static upd_fields = ['title', 'title_slo', 'date', 'active', 'info'];
	static ups_fields = ['id'].concat(this.upd_fields);

	static model_to_db(record) {
		let info = record['info'];
		if( typeof(info) == 'object' )
			record['info'] = JSON.stringify( info );

		return record;
	}

	static db_to_model(record) {
		if (!record) return null;

		if (record['date']) {
			record['date'] = this.parse_dt(record['date']);
		}

		let info = record['info'];
		if (typeof(info) == 'string' ) {
			let info_js = JSON.parse(info);

			if( info_js && info_js.protocol && info_js.protocol.dt )
				info_js.protocol.dt = this.parse_dt(info_js.protocol.dt);

			if( info_js && info_js.document && info_js.document.dt )
				info_js.document.dt = this.parse_dt(info_js.document.dt);

			record['info'] = info_js;
		}
		return record;
	}

	static get_active() {
		let sql = this.table().where( { active: true } );
		// this.debug( sql );
		return sql.then( results => results.map(x => this.db_to_model(x)) );
	}
}

module.exports = Event;