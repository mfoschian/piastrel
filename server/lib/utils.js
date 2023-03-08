function isEmpty(s) {
	if( s == null || s == '' )
		return true;
	else
		return false;
}

function joinIfNotEmpty( a, b, sep ) {
	if(isEmpty(b))
		return a;

	if(isEmpty(a))
		return b;

	return sep ? a + sep + b : a + b;
}

function trimmed(s) {
	if( s == null ) return null;
	try {
		let v = s.trim();
		if( v == '' )
			return null;
		return v;
	}
	catch( err ) {
		console.error( err );
		return null;
	}
}

module.exports = {
	isEmpty,
	joinIfNotEmpty,
	trimmed
};