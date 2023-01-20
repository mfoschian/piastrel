export function isEmpty(v) {
	if( v == null || v == '' )
		return true;
	else
		return false;
}

const rgx = /([0-9]+).*/;

export function startNumber(s) {
	let n = Number(s);
	if( !isNaN(n) ) return n;
	let m = s.match(rgx);
	if(!m) return NaN;
	return Number(m[1]);
};

export function deepClone( obj ) {
	let s = JSON.stringify(obj);
	return JSON.parse(s);
}
