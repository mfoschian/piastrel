import Server from '../Server'
// import { ref } from 'vue'

// let _items = ref([]);

export const Person = {

	async search(filter) {
		let q = filter || '';
		let result = await Server.get('/persons/search', { q });
		if( result && result.items )
			// _items.value = result.items;
			return result.items;
		else
			// _items.value = [];
			return [];
	}

};