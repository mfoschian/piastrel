<template>
	<TopBar :event_name="event_name" />
	<h4 v-if="load_message">{{ load_message }}</h4>
	<h4 v-if="loaded && !event">Nessun evento attivo: <a href="#">attivane uno</a></h4>
	<router-view />
</template>

<script>
// import Settings from './settings'
import TopBar from './components/TopBar.vue'
import State from './State.js'
import Server from './Server.js'

import { computed, onMounted } from 'vue'

/*
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
*/

async function load_state() {
	let state = State.get();

	state.load_message.value = "Caricamento evento attivo";
	let active_ev = await Server.get_active_event();
	if( !active_ev || !active_ev.id ) {
		state.load_message.value = "";
		state.loaded.value = true;
		return state;
	}
	
	state.load_message.value = "Caricamento sezioni";
	state.buckets.value = await Server.get_buckets();

	state.load_message.value = "Caricamento convocati";
	state.active_event.value = active_ev;
	state.convocations.value = await Server.get_convocations( active_ev.id );

	state.load_message.value = "";
	state.loaded.value = true;
}

export default {
	components: { TopBar },
	setup() {

		let state = State.get();
		let event = state.active_event;
		
		let page_state = {
			event,
			event_name: computed( () => {
				return (event.value == null ? "" : event.value.name );
			}),
			
			//date,
			load_message: state.load_message,
			loaded: state.loaded
		};

		// const route = useRoute();

		onMounted( async () => {
			let st = await load_state();
		});

		return page_state;
	},
	methods: {
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
