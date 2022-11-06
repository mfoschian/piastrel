let BaseModel = require('./BaseModel.js');

class Person extends BaseModel {

	static table_name = 'persons';
	static upd_fields = ['first_name','last_name','code','note'];
	static ups_fields = ['id'].concat(this.upd_fields);

}

module.exports = Person;