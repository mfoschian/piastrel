import Server from '../Server'
import { ref } from 'vue'

let _items = ref([]);

export const Bucket = {

	async load() {
		let result = await Server.get('/buckets');
		if( result && result.items )
			_items.value = result.items;
		else
			_items.value = [];
	},

	all() {
		return _items;
	}

};