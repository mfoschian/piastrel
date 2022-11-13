const BASE_URL = 'http://localhost:3000/api'

import { getJson, postJson, putJson, deleteJson } from './libs/json-fetch'

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

	async create( url, params ) {
		try {
			let res = await postJson( _url( url ), params );
			if( ! res.item ) {
				throw res.message || "Error posting";
			}
			return res.item;
		}
		catch( err ) {
			console.error( 'Error posting to %s: %s', url, err );
			throw err;
		}
	}
}