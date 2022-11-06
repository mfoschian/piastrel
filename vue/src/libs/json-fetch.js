export async function getJson( url, params ) {
	let res = null;
	try {
		let fetch_url = url;
		if( typeof(params) == 'object' ) {
			let fetch_params = new URLSearchParams( params );
			fetch_url += "?" + fetch_params.toString();
		}
		res = await fetch( fetch_url );
		if( res.status == '404' ) {
			return null;
		}
	}
	catch( err ) {
		console.error( err );
		return null;
	}

	// il json malformato lo lascio ai catch dei chiamanti, quindi il parse lo tengo fuori dal try/catch
	return await res.json();
}

export async function sendJson( method, url, data ) {
	if( !method ) {
		console.error( 'No method specified in sendJson' );
		return null;
	}
	let res = null;

	try {
		let params = {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}
		if( data != null && typeof(data) != 'undefined' ) {
			params.body = JSON.stringify( data );
		}
		res = await fetch( url, params );
		if( res.status == '404' ) {
			return null;
		}
	}
	catch( err ) {
		console.error( err );
		return null;
	}
	
	// il json malformato lo lascio ai catch dei chiamanti, quindi il parse lo tengo fuori dal try/catch
	return await res.json();
}

export async function postJson( url, data) {
	return sendJson( 'POST', url, data );
}

export async function putJson( url, data) {
	return sendJson( 'PUT', url, data );
}

export async function deleteJson( url, data) {
	return sendJson( 'DELETE', url, data );	
}

