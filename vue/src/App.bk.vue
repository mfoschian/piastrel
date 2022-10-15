<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import TopBar from './components/TopBar.vue'
import ScheduleView from './components/ScheduleView.vue'
</script>

<template>
	<TopBar :room_name="room.label" :date="date" @dateChanged="dateChanged"/>

	<ScheduleView />
</template>

<script>
import Settings from './settings'
import Config from './config'

function getParms() {
	let res = {
		the_date: null,
		roomObj: null,
		room: null
	};

	try {
		// Day specification
		let url = new URL(window.location.href);
		let searchParams = new URLSearchParams(url.search);
		let v = searchParams.get('at');
		if( v ) {
			let ms = Date.parse(v);
			if(!isNaN(ms))
				// Se il parametro non è interpretabile come data, allora il fallback è "oggi"
				res.the_date = v;
		}

		// room specification
		v = searchParams.get('room');
		if( v ) {
			if( searchParams.get('save') != null )
				Settings.room.save( v );
			else if( searchParams.get('clear') != null )
				Settings.room.clear();
		}
		else {
			v = Settings.room.get();
		}

		let r = Config.rooms[v];
		if( r ) {
			res.room = {
				name: v,
				label: r.label
			};
			console.log( 'Sala selezionata: %s (%s)', res.room.v, res.room.label );
		}
	}
	catch( err ) {
		console.log( err );
	}

	return res;
}


export default {
	data() {
		return {
			room: {
				name: null,
				label: null
			},
			date: null
		}
	},
	methods: {
		dateChanged(new_date) {

			var dest = window.location.origin + window.location.pathname + "?at=" + new_date;
			if( this.room.name != null ) {
			 	dest += '&room=' + this.room.name;
			}

			window.location.href = dest;
		}		
	},
	mounted() {
		let parms = getParms();
		console.log( parms );
		if( parms ) {
			if( parms.room ) {
				this.room.name = parms.room.name;
				this.room.label = parms.room.label;
			}

			if( parms.the_date ) {
				this.date = parms.the_date;
			}
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
