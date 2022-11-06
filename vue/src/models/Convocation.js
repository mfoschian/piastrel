import Server from '../Server'
import { ref } from 'vue'

let _items = ref([]);

export const Convocation = {

	async load() {
		let result = await Server.get('/convocations');
		_items.value = result.items;
	},

	all() {
		return _items;
	}

};