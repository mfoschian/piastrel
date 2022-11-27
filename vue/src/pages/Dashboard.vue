<template>
	<BasePage :subtitle="subtitle">
		<template #topbar >
			<h3>Gestione Scrutatori</h3>
		</template>
		<div class="dashboard container fluid">
			<h4 v-if="!has_event">Nessun evento attivo:
				<router-link to="/events" >
					<span class="badge bg-danger">attivane uno</span>
				</router-link>
			</h4>

			<ConvocationsBox event_id="event.id" />

			<BucketsBox />

			
		</div>
	</BasePage>
</template>

<script>
import { computed, watchEffect } from 'vue'

import BasePage from './BasePage.vue'
import BucketsBox from '../components/BucketsBox.vue'
import ConvocationsBox from '../components/ConvocationsBox.vue'

import Application from '../models/Application'
import { Event } from '../models/Event'


export default {
	components: { BasePage, ConvocationsBox, BucketsBox },
	async setup() {

		let _event = Event.get_active(); // reactive
		let has_event = computed( () => _event.value == null ? false : true );
		let subtitle = computed( () => _event.value == null ? null : _event.value.title );

		await Event.load_active();


		return {
			has_event, 
			event: _event,
			subtitle
		};
	}
}
</script>