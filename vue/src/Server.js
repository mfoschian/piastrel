const BASE_URL = 'http://localhost:3000/api'

import { getJson } from './libs/json-fetch'

function _url( url ) {
	return BASE_URL + url;
}

export default {
	async get( url, params ) {
		try {
			let items = getJson( _url( url ), params );
			return items;
		}
		catch( errors ) {
			console.error( "ERR: get %s: %s", url, errors );
			return [];
		}
	},
	async save_event( ev ) {
		return null;
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