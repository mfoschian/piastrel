import Server from '../Server'
import { ref } from 'vue'

let _items = ref([]);

export const Convocation = {

	async load() {
		let result = await Server.get('/convocations');
		if( result && result.items )
			_items.value = result.items;
		else
			_items.value = [];
	},

	all() {
		return _items;
	},

	ofPerson(id) {
		let c = _items.value.filter( c => c.person_id == id )[0];
		return c;
	},

	inBucket(id) {
		let bb = _items.value.filter( c => c.bucket_id == id );
		return bb;
	}

};