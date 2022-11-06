<template>
	<div class="dashboard">
		<h4 v-if="!has_event">Nessun evento attivo: <a href="#">attivane uno</a></h4>

		<div class="convocations">
			Convocati: {{ convocations.lenght || 'ancora nessuno'}}
		</div>

		<div class="buckets">
			<div v-for="b in buckets" :key="b.id">
				<div class="bucket">{{ b.name }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { computed, watchEffect } from 'vue'

import Application from '../models/Application'
import { Event } from '../models/Event'
import { Bucket } from '../models/Bucket'
import { Convocation } from '../models/Convocation'

export default {
	async setup() {

		Application.subtitle.value = "Dashboard";

		let _event = Event.get_active(); // reactive
		let has_event = computed( () => _event.value == null ? false : true );

		let _buckets = Bucket.all(); // reactive
		let _convocations = Convocation.all(); // reactive

		await Bucket.load();
		await Event.load_active();

		watchEffect( async () => {
			console.log( 'watch effect');
			if( _event.value != null ) {
				Application.subtitle.value = _event.value.title;
				console.log( 'Loading convocations for event %s...', _event.value.id );
				await Convocation.load( _event.value.id );
			}
		});

		return {
			has_event, 
			event: _event,
			buckets: _buckets,
			convocations: _convocations
		};
	}
}
</script>