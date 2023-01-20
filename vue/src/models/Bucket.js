import Server from '../Server'
import { ref } from 'vue'

let _items = ref([]);

export const Bucket = {

	async load() {
		let result = await Server.get('/buckets');
		if( result && result.items )
			_items.value = result.items;
		else
			_items.value = [];
	},

	all() {
		return _items;
	},

	get(id) {
		let b = _items.value.filter( b => b.id == id )[0];
		return b;		
	},

	new() {
		return {
			id: null,
			name: '',
			number: '',
			address: null,
			name_slo: '',
			address_slo: null
		}
	},


	async save( bkt ) {
		if( bkt && bkt.id == null ) {
			let new_id = await Server.create('/buckets', bkt);
			let res = await Server.get('/buckets/' + new_id);
			if( res ) {
				_items.value.push( res );
			}
			return res;
		}
		else {
			let res = await Server.update('/buckets/' + bkt.id, bkt );
	
			let items = _items.value;
			for( let i=0; i<items.length; i++ ) {
				if( items[i].id == bkt.id ) {
					_items.value[i] = res;
					return res;
				}
			}
			return res;
		}
	},

	async remove( id ) {
		if( !id )
			return;

		let res = await Server.remove( '/buckets/' + id );

		let items = _items.value;
		for( let i=0; i<items.length; i++ ) {
			if( items[i].id == id ) {
				_items.value.splice(i,1);
			}
		}
	}


};