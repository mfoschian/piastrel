import Server from '../Server'
import { dateValue } from '../libs/formatters'
import { computed, ref } from 'vue'

let _items = ref([]);
const BASE_URL = '/convocations';

const Status = {
	unknown: 'convocated',
	contacted: 'contacted',
	accepted: 'accepted',
	rejected: 'rejected',
	confirmed: 'confirmed'
};

function adjustRecord( r ) {
	if( r )
		r.doc_dt = dateValue(r.doc_dt);
	return r;
}

export const Convocation = {
	status: Status,

	async load(event_id) {

		let url = BASE_URL;
		if(event_id)
			url += '?event=' + event_id;

		let result = await Server.get(url);
		if( result && result.items )
			_items.value = result.items.map( r => adjustRecord(r) );
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
			status: Status.unknown,
			note: null,
			doc_dt: null,
			doc_number: null
		}
	},

	async save( c ) {
		if( c && c.id == null ) {
			let new_id = await Server.create(BASE_URL, c);
			let res = await Server.get(BASE_URL + '/' + new_id);
			if( res ) {
				_items.value.push( res );
			}
			return res;
		}
		else {
			let res = await Server.update(BASE_URL + '/' + c.id, c );
			res = adjustRecord(res);

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

		let res = await Server.remove( BASE_URL + '/' + id );

		let items = _items.value;
		for( let i=0; i<items.length; i++ ) {
			if( items[i].id == id ) {
				_items.value.splice(i,1);
			}
		}
	},

	confirmPdfUrl( id ) {
		return Server.url_for(BASE_URL + '/' + id + '/confirmation.pdf');
	},

	bucketConfirmPdfUrl( bucket_id ) {
		let conv = _items.value[0];
		if( conv == null ) {
			console.error('No convocations');
			return null;
		}
		let event_id = conv.event_id;
		return Server.url_for('/events/' + event_id + '/buckets/' + bucket_id + '/confirmations.pdf');
	}

};

export const Stats = {
	rejected: computed( () => {
		let cc = _items.value || [];
		return cc.filter( c => c.status == Convocation.status.rejected );
	})
}