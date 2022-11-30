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

			<template v-else>
				<ConvocationsBox event_id="event.id" @details="openDetails" />

				<BucketsBox @details="openDetails" />

				<RejectedBox @details="openDetails" />
			</template>

			<div class="modal fade" :class="{ show: detailsVisible, 'd-block': detailsVisible }">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">Dettaglio Persona</div>
						<button type="button" class="btn-close" @click="detailsVisible=false"></button>
					</div>
					<div class="modal-body">
						<ConvocatedPersonDetails :item="convocation"
							@cancel="detailsVisible=false"
							@saveStatus="saveStatus"
						/>
					</div>
				</div>
			</div>
		</div>

		</div>
	</BasePage>
</template>

<script>
import { computed, ref } from 'vue'

import BasePage from './BasePage.vue'
import BucketsBox from '../components/BucketsBox.vue'
import ConvocationsBox from '../components/ConvocationsBox.vue'
import ConvocatedPersonDetails from '../components/ConvocatedPersonDetails.vue'
import RejectedBox from '../components/RejectedBox.vue'

import { Event } from '../models/Event'
import { Convocation } from '../models/Convocation'


export default {
	components: { BasePage, ConvocationsBox, BucketsBox, RejectedBox, ConvocatedPersonDetails },
	async setup() {

		let _event = Event.get_active(); // reactive
		let has_event = computed( () => _event.value == null ? false : true );
		let subtitle = computed( () => _event.value == null ? null : _event.value.title );

		await Event.load_active();

		let detailsVisible = ref(false);
		let convocation = ref({});

		const openDetails = (pid) => {
			let c = Convocation.ofPerson(pid);
			convocation.value = c;
			detailsVisible.value = true;
		};

		const saveStatus = async (new_status) => {
			let c = convocation.value;
			let upd = {
				id: c.id,
				status: new_status
			}
			let res = await Convocation.save(upd);
			detailsVisible.value = false;
		};

		return {
			has_event, 
			event: _event,
			subtitle,

			detailsVisible,
			convocation,
			openDetails,
			saveStatus
		};
	}
}
</script>