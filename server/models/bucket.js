let BaseModel = require( './BaseModel.js' );


class Bucket extends BaseModel {

	static table_name = 'buckets';
	static upd_fields = ['name','inferred_status'];
	static ups_fields = ['id'].concat(this.upd_fields);

}

module.exports = Bucket;