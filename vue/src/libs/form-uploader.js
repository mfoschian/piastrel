export async function sendForm( formRef ) {
	if(!formRef || !formRef.value ) {
		console.error('form not found');
		return null;
	}

	let form = formRef.value;
	let url = form.getAttribute('action');
	if( !url || url == '' ) {
		console.error( 'No action attribute on form');
		return null;
	}

	let method = form.getAttribute('method') || 'POST';
	let res = null;
	
	try {
		let data = new FormData( form );
		let params = {
			method: method.toUpperCase(),
			// headers: {
			// },
			body: data
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
	
	let result = null;
	let res2 = res.clone();
	try {
		result = await res.json();
	}
	catch( err ) {
		console.log( "fetch result is not json");
		result = await res2.text();
	}
	return result;
}
