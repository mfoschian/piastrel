const BASE_URL = 'http://localhost:3000/api'

import { getJson, postJson, putJson, deleteJson } from './libs/json-fetch'

function _url( url ) {
	return BASE_URL + url;
}

export default {
	url_for: _url,

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
			if( ! res.new_id ) {
				throw res.message || "Error posting";
			}
			return res.new_id;
		}
		catch( err ) {
			console.error( 'Error posting to %s: %s', url, err );
			throw err;
		}
	},

	async update( url, params ) {
		try {
			let res = await putJson( _url( url ), params );
			if( ! res.item ) {
				throw res.message || "Error putting";
			}
			return res.item;
		}
		catch( err ) {
			console.error( 'Error posting to %s: %s', url, err );
			throw err;
		}
	},

	async remove( url ) {
		try {
			let res = await deleteJson( _url( url ) );
			if( res && res.success == true )
				return;

			throw res.message || "Error deleting";
		}
		catch( err ) {
			console.error( 'Error deleting to %s: %s', url, err );
			throw err;
		}
	}
}