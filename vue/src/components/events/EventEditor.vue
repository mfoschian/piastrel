<template>
	<form>
		<label for="event_name">Nome Evento</label>
		<input type="text" v-model="title" />
		<input type="date" v-model="date" />
		<input type="checkbox" v-model="active" />
		<hr>
		<button @click="save">Salva</button>
		<button @click="cancel">Annulla</button>
	</form>
</template>

<script>
import Server from '../../Server.js'
import { ref } from 'Vue'

export default {
	props: {
		event: { type: Object, required: true }
	},
	emits: [ 'save', 'cancel' ],
	setup(props,context) {
		let event = {
			id: ref( props.event.id),
			title: ref(props.event.title || ""),
			date: ref(props.event.date),
			active: ref(!!props.event.active)
		};
		
		const reset = () => {
			event.id = props.event.id;
			event.title = props.event.title;
			event.date = props.event.date;
			event.active = !!props.event.active;
		}

		const save = async () => {
			let ev = {
				id: event.id.value,
				title: event.title.value,
				date: event.date.value,
				active: event.date.value
			};

			context.emit('save', ev);		
		};

		const cancel = () => {
			// reset(); // ?
			context.emit('cancel');
		};

		return { ...event, save, cancel };
	}
}
</script>