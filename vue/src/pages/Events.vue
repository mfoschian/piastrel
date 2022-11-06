<template>
	<div class="event-list">
		<div v-for="event in items" :key="event.id">
			<div class="title">
				{{ event.title }}
			</div>
			<div class="date">
				{{ event.date }}
			</div>
			<div class="active">
				{{ event.active ? 'Attivo' : 'Chiuso' }}
			</div>
		</div>
	</div>
</template>

<script>

// import { ref } from 'vue'

import Application from '../models/Application';
import { Event } from '../models/Event'

export default {
	async setup(props,context) {

		const max_items = 20;
		let _items = await Event.load( max_items ); // reactive !

		Application.subtitle.value = "Eventi";

		return {
			items: _items
		}
	}
}

</script>