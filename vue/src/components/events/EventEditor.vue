<template>
	<form>
		<label for="event_name">Nome Evento</label>
		<input type="text" id="event_name" v-model="name" />
		<hr>
		<button @click="save_record">Salva</button>
	</form>
</template>

<script>
import Server from '../../Server.js'
import { ref } from 'Vue'

export default {
	setup(props) {
		let event = {
			name: ref(props.name || ""),
			id: ref(props.id || -1)
		}
		
		return event;
	},
	methods: {
		async save_record() {
			let ev = {
				id: this.id.value,
				name: this.name.value
			}

			let ok = await Server.save_event( ev );
		}
	}
}
</script>