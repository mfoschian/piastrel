export function pad2(n) {
	return n < 10 ? '0'+n : ''+n; 
}
export function dateValue(dt) {
	let d = dt ? new Date(dt) : new Date();
	return d.getFullYear() + '-'
			+ pad2(d.getMonth()+1) + '-'
			+ pad2(d.getDate())
	;
}