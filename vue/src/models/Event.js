import Server from '../Server'
import { ref, computed } from 'vue'
import { dateValue } from '../libs/formatters'

let _items = ref([]);
let _active_event = ref(null);

function adjustRecord( r ) {
	if( r )
		r.date = dateValue(r.date);
	return r;
}

export const Event = {

	async load( limit ) {
		let lim = parseInt(limit);
		lim = isNaN(lim) ? 20 : lim;
		let result = await Server.get('/events', {limit: lim});
		if( result.items ) {
			for( let i=0; i<result.items.length; i++ ) {
				adjustRecord( result.items[i] );
			}
		}
		_items.value = result.items;
		return _items;
	},

	async load_active() {
		let _actives = await Server.get('/events/active');
		_active_event.value = adjustRecord( _actives.items[0] );
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
			active: false
		}
	},

	async save( ev ) {
		if( ev && ev.id == null ) {
			let res = await Server.create('/events', ev);
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
					_items.value[i] = adjustRecord( res );
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
	}

};