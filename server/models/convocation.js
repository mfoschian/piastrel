let BaseModel = require( './BaseModel.js' );


class Convocation extends BaseModel {


	static table_name = 'convocation';
	static upd_fields = ['person_id','event_id','bucket_id','status','note'];
	static ups_fields = ['id'].concat(this.upd_fields);


}

module.exports = Convocation;