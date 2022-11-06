import Server from '../Server'
import { ref, computed } from 'vue'

let _items = ref([]);
let _active_event = ref(null);

export const Event = {

	async load( limit ) {
		let lim = parseInt(limit);
		lim = isNaN(lim) ? 20 : lim;
		let result = await Server.get('/events', {limit: lim});
		_items.value = result.items;
		return _items;
	},

	async load_active() {
		let _actives = await Server.get('/events/active');
		_active_event.value = _actives.items[0];
		return _active_event;
	},

	all() {
		return _items;
	},

	get_active() { return _active_event; }

};