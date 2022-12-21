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
	},

	async contactsOf(person_id) {
		let result = await Server.get(`/persons/${person_id}/contacts`);
		if( result && result.items )
			return result.items;
		else
			return [];
	},

	async saveContact(c) {
		let result = null;
		if( c.id == null ) {
			let new_id = await Server.create(`/persons/${c.person_id}/contacts`, c);
			result =  await Server.get(`/persons/${c.person_id}/contacts/${new_id}`);
		}
		else
			result = await Server.update(`/persons/${c.person_id}/contacts/${c.id}`, c);
		return result;
	},

	async deleteContact(c) {
		let result =  await Server.remove(`/persons/${c.person_id}/contacts/${c.id}`);
		return result;
	}
};