import Server from '../Server'
import { ref, computed } from 'vue'
import { dateValue } from '../libs/formatters'

let _items = ref([]);
let _active_event = ref(null);

function adjustRecord( r ) {
	if( r ) {
		r.date = dateValue(r.date);
		if( r.info && r.info.protocol && r.info.protocol.dt ) {
			r.info.protocol.dt = dateValue( r.info.protocol.dt );
		}
		if( r.info && r.info.document && r.info.document.dt ) {
			r.info.document.dt = dateValue( r.info.document.dt );
		}
	}
	return r;
}

export const Event = {

	async get( limit ) {
		let lim = parseInt(limit);
		lim = isNaN(lim) ? 20 : lim;
		let result = await Server.get('/events', {limit: lim});
		if( result == null ) {
			_items.value = [];
			return _items;
		}

		if( result.items ) {
			for( let i=0; i<result.items.length; i++ ) {
				adjustRecord( result.items[i] );
			}
		}
		_items.value = result.items;
		return _items;
	},

	async load(id) {
		let event_id = id || 'active';
		let _active = await Server.get('/events/' + event_id);
		_active_event.value = adjustRecord( _active );
		return _active_event;
	},

	all() {
		return _items;
	},

	get_active() { return _active_event; },

	new() {
		return {
			id: null,
			title: null,
			date: dateValue( new Date() ),
			active: false,
			info: {
				it: {
					appointment_dt : null,
					range: null
				},
				slo: {
					appointment_dt : null,
					range: null
				},
				signer: {
					first_name: null,
					last_name: null,
					title_it: null,
					title_slo: null,
					sign: null
				},
				protocol: {
					dt: null,
					number: null
				},
				document: {
					dt: null,
					number: null
				}
			}
		}
	},

	async save( ev ) {
		if( ev && ev.id == null ) {
			let new_id = await Server.create('/events', ev);
			let res = await Server.get('/events/' + new_id);
			if( res ) {
				_items.value.push( adjustRecord( res ) );
			}
			return res;
		}
		else {
			let res = await Server.update('/events/' + ev.id, ev );
	
			let items = _items.value;
			for( let i=0; i<items.length; i++ ) {
				if( items[i].id == ev.id ) {
					let r = adjustRecord( res );
					_items.value[i] = r;
					return r;
				}
			}
			return res;
		}
	},

	async remove( id ) {
		if( !id )
			return;

		let res = await Server.remove( '/events/' + id );

		let items = _items.value;
		for( let i=0; i<items.length; i++ ) {
			if( items[i].id == id ) {
				_items.value.splice(i,1);
			}
		}
	},

	reportUrl( event_id, report_name ) {
		return Server.url_for('/events/' + event_id + '/report/' + report_name);
	},


};