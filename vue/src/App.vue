<template>
	<TopBar :room_label="room_label" :date="date" @dateChanged="dateChanged" />
	<router-view />
</template>

<script>
import Settings from './settings'
import Config from './config'

import TopBar from './components/TopBar.vue'

import { useRoute } from 'vue-router'
import { ref, watchEffect, onMounted } from 'vue'


function p2(n) {
	return n < 10 ? '0'+n : ''+n; 
}
function dateValue(dt) {
	let d = dt ? new Date(dt) : new Date();
	return d.getFullYear() + '-'
			+ p2(d.getMonth()+1) + '-'
			+ p2(d.getDate())
	;
}

export default {
	components: { TopBar },
	setup() {
		let room_id = ref(null);
		let room_label = ref(null);
		let date = ref(dateValue(null));

		let state = {
			room_id,
			room_label,
			date
		};

		const route = useRoute();
		// watch( () => route.query.at, () => {
		watchEffect( () => {
			console.log( 'watchEffect' );
			let v = route.query.at;
			if( v && v != date.value ) {
				let ms = Date.parse(v);
				if(!isNaN(ms)) {
					// Data valida
					date.value = v;
					console.log( 'Date changet to %s', date.value );
					// let args =  { date = route.query.at };
					// updateMe(state, args) // Aggiorna lista eventi in quella data ?
				}
			}

			let rid = route.query.room;
			if( rid && rid != room_id.value ) {
				let r = Config.rooms[rid];
				if( r ) {
					room_id.value = rid;
					room_label.value = r.label;
					console.log( 'Sala selezionata: %s (%s)', room_id.value, room_label.value );
				}				
			}

		});

		onMounted( () => {
			// room specification
			let rid = route.params.id || route.query.room;
			if( rid ) {
				if( route.query.save != null )
					Settings.room.save( rid );
				else if( route.query.clear != null )
					Settings.room.clear();
			}
			else {
				rid = Settings.room.get();
			}

			room_id.value = rid;

			let r = Config.rooms[rid];
			if( r ) {
				room_label.value = r.label;
				console.log( 'Sala selezionata: %s (%s)', room_id.value, room_label.value );
			}
		});

		return state;
	},
	methods: {
		dateChanged(new_date) {
			let query = {
				at: new_date,
			};
			if( this.room_name )
				query.room = this.room_name;

			this.$router.push( { path: '/', query } );
		}
	}
}
</script>


<style scoped>
/*
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
*/
</style>
