let _persons = {
	1: {
		id: 1,
		last_name: 'Foschian',
		first_name: 'Marco',
		code: 'XXXX'
	}
}



let Store = {
	allPersons() {
		return Object.values(_persons);
	},
	getPerson(id) {
		return _persons[id];
	},
	updPerson(id, values) {
		let p = _persons[id];
		if( !p )
			return null;
		let np = Object.assign( p, values );
		_persons[id] = np;
		return np;
	},
	delPerson(id) {
		let p = _persons[id];
		if( !p )
			return false;
		else {
			delete _persons[id];
			return true;
		}

	},
	addPerson(p) {
		if(!p) return false;
		let values = Object.values(_persons);
		// let newIx = values.length + 1;
		let newIx = 0;
		values.map( p => { if( p.id > newIx ) newIx = p.id + 1} );
		console.log( 'new id is %d', newIx );

		let newp = Object.assign( {id: newIx}, p );

		_persons[newIx] = newp;
		return p;
	}
}

module.exports = Store;