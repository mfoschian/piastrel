let DB = require( '../db/database.js' );

let Person = {
	all() {
		return DB.allPersons();
	},
	get(id) {
		return DB.getPerson( id );
	},
	del(id) {
		return DB.delPerson( id );
	},
	create(p) {
		return DB.addPerson( p );
	},
	update(id, p) {
		return DB.updPerson( id, p );
	}
}

module.exports = Person;