let BaseModel = require( './BaseModel.js' );


class Bucket extends BaseModel {

	static table_name = 'buckets';
	static upd_fields = ['number','name','address','name_slo','address_slo','inferred_status'];
	static ups_fields = ['id'].concat(this.upd_fields);

}

module.exports = Bucket;