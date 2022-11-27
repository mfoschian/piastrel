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
	}

};