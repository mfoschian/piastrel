const ls_key = 'vcf-room';

export default {
	room: {
		get() {
			return window.localStorage.getItem( ls_key );
		},
		save(name) {
			window.localStorage.setItem( ls_key, name );
		},
		clear() {
			window.localStorage.removeItem( ls_key );
		}
	},
	date: {
		get() {
			
		}
	}
}

