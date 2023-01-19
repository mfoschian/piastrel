function pad2(n) {
	return n < 10 ? '0'+n : ''+n; 
}


const tags_renders = [
	(s,dt) => s.replace(/YYYY/g, dt.getFullYear()),
	(s,dt) => s.replace(/MM/g, pad2(dt.getMonth()+1)),
	(s,dt) => s.replace(/M/g, dt.getMonth()+1),
	(s,dt) => s.replace(/DD/g, pad2(dt.getDate())),
	(s,dt) => s.replace(/D/g, dt.getDate()),
	(s,dt) => s.replace(/HH/g, pad2(dt.getHours())),
	(s,dt) => s.replace(/H/g, dt.getHours()),
	(s,dt) => s.replace(/mm/g, pad2(dt.getMinutes())),
	(s,dt) => s.replace(/m/g, dt.getMinutes())
];

function formatDate(format, dt) {
	if(!format) return '';
	let s = format;
	let d = dt || new Date();

	for( let i=0; i<tags_renders.length; i++ ) {
		let replace = tags_renders[i];
		s = replace(s,d);
	}
	return s;
}

module.exports = {
	formatDate
};