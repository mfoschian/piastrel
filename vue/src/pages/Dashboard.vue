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
				<ConvocationsBox :event_id="event.id" :read_only="read_only"
					@openSearchBox="searchVisible=true"
					@details="openDetails"
				/>

				<BucketsBox @details="openDetails" :read_only="read_only" />

				<RejectedBox @details="openDetails" :read_only="read_only" />
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
							:read_only="read_only"
						/>
					</div>
				</div>
			</div>
		</div>

			<div class="modal fade" :class="{ show: searchVisible, 'd-block': searchVisible }">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">Ricerca Persona</div>
						<button type="button" class="btn-close" @click="searchVisible=false"></button>
					</div>
					<div class="modal-body">
						<PersonSearch @selected="addPerson" />
					</div>
				</div>
			</div>

		</div>

		</div>
	</BasePage>
</template>

<script>
import { computed, ref, watchEffect } from 'vue'

import BasePage from './BasePage.vue'
import BucketsBox from '../components/BucketsBox.vue'
import ConvocationsBox from '../components/ConvocationsBox.vue'
import ConvocatedPersonDetails from '../components/ConvocatedPersonDetails.vue'
import RejectedBox from '../components/RejectedBox.vue'
import PersonSearch from '../components/PersonSearch.vue'

import { Event } from '../models/Event'
import { Convocation } from '../models/Convocation'


export default {
	components: { BasePage, ConvocationsBox, BucketsBox, RejectedBox, ConvocatedPersonDetails, PersonSearch },
	props: {
		event_id: { type: [String,Number], default: null }
	},
	async setup(props) {

		let _event = Event.get_active(); // reactive
		let has_event = computed( () => _event.value == null ? false : true );
		let subtitle = computed( () => _event.value == null ? null : 
			_event.value.active ? _event.value.title : _event.value.title + ' (chiuso)'
		);

		let detailsVisible = ref(false);
		let searchVisible = ref(false);
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

		let read_only = computed( () => {
			return !has_event || _event.value == null || !_event.value.active;
		});

		watchEffect( async () => {
			Convocation.clear();
			await Event.load(props.event_id);
		});

		const addPerson = async (p) => {
			console.log('choosed person %s', p.code);
			let c = Convocation.new();
			c.person_id = p.id;
			c.event_id = _event.value.id;
			let res = await Convocation.save(c);
			searchVisible.value = false;
		};

		return {
			has_event, 
			event: _event,
			subtitle,

			detailsVisible,
			convocation,
			openDetails,
			saveStatus,

			searchVisible,
			addPerson,

			read_only
		};
	}
}
</script>