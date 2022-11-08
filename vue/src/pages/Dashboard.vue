<template>
	<BasePage :subtitle="subtitle">
		<template #topbar >
			<h3>Gestione Scrutatori</h3>
		</template>
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
	</BasePage>
</template>

<script>
import { computed, watchEffect } from 'vue'

import BasePage from './BasePage.vue'
import Application from '../models/Application'
import { Event } from '../models/Event'
import { Bucket } from '../models/Bucket'
import { Convocation } from '../models/Convocation'

export default {
	components: { BasePage },
	async setup() {

		let _event = Event.get_active(); // reactive
		let has_event = computed( () => _event.value == null ? false : true );
		let subtitle = computed( () => _event.value == null ? null : _event.value.title );

		let _buckets = Bucket.all(); // reactive
		let _convocations = Convocation.all(); // reactive

		await Bucket.load();
		await Event.load_active();

		watchEffect( async () => {
			console.log( 'watch effect');
			if( _event.value != null ) {
				console.log( 'Loading convocations for event %s...', _event.value.id );
				await Convocation.load( _event.value.id );
			}
		});

		return {
			has_event, 
			event: _event,
			buckets: _buckets,
			convocations: _convocations,
			subtitle
		};
	}
}
</script>