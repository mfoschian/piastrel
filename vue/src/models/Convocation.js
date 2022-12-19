import Server from '../Server'
import { computed, ref } from 'vue'

let _items = ref([]);
const BASE_URL = '/convocations';

const Status = {
	unknown: 'convocated',
	accepted: 'accepted',
	rejected: 'rejected',
	confirmed: 'confirmed'
};

export const Convocation = {
	status: Status,

	async load(event_id) {

		let url = BASE_URL;
		if(event_id)
			url += '?event=' + event_id;

		let result = await Server.get(url);
		if( result && result.items )
			_items.value = result.items;
		else
			_items.value = [];
	},

	clear() {
		_items.value = [];
	},

	all() {
		return _items;
	},

	ofPerson(id) {
		let c = _items.value.filter( c => c.person_id == id )[0];
		return c;
	},

	inBucket(id) {
		let bb = _items.value.filter( c => c.bucket_id == id );
		return bb;
	},

	async assign(pid, bid, status) {

		let c = Convocation.ofPerson(pid);
		if( !c )
			return null;

		let upd = {
			id: c.id,
			person_id: c.person_id,
			bucket_id: bid
		};
		if( typeof(status) != 'undefined') {
			upd.status = status;
		}

		let res = await Convocation.save(upd);
		c.bucket_id = res.bucket_id;
	},

	new() {
		return {
			id: null,
			person_id: null,
			bucket_id: null,
			status: Status.unknown
		}
	},

	async save( c ) {
		if( c && c.id == null ) {
			let new_id = await Server.create('/convocations', c);
			let res = await Server.get('/convocations/' + new_id);
			if( res ) {
				_items.value.push( res );
			}
			return res;
		}
		else {
			let res = await Server.update('/convocations/' + c.id, c );

			let items = _items.value;
			for( let i=0; i<items.length; i++ ) {
				if( items[i].id == c.id ) {
					_items.value[i] = res;
					break;
				}
			}
			return res;		
		}
	},

	async remove( id ) {
		if( !id )
			return;

		let res = await Server.remove( '/convocations/' + id );

		let items = _items.value;
		for( let i=0; i<items.length; i++ ) {
			if( items[i].id == id ) {
				_items.value.splice(i,1);
			}
		}
	},

	confirmPdfUrl( id ) {
		return Server.url_for(BASE_URL + '/' + id + '/confirmation.pdf');
	}

};

export const Stats = {
	rejected: computed( () => {
		let cc = _items.value || [];
		return cc.filter( c => c.status == Convocation.status.rejected );
	})
}