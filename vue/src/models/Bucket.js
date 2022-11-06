import Server from '../Server'
import { ref } from 'vue'

let _items = ref([]);

export const Bucket = {

	async load() {
		let result = await Server.get('/buckets');
		_items.value = result.items;
	},

	all() {
		return _items;
	}

};