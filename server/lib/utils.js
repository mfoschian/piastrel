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

module.exports = {
	isEmpty,
	joinIfNotEmpty
};