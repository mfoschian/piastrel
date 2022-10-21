export default {
	async get_active_event() {
		return null;
	},
	async save_event( ev ) {
		return null;
	},
	async get_buckets() {
		return new Promise( (resolve) => {
			setTimeout( () => [], 2000);
		});
		// return [];
	},
	async save_bucket( b ) {
		return [];
	},
	async get_convocations(event_id) {
		return [];
	},
	async save_convocation( conv ) {
		return [];
	},
	async search_person( p ) {
		return null;
	},
	async save_contact( contact ) {
		return true;
	}
}