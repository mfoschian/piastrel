<template>
	<BasePage :subtitle="theEvent.title">
		<template #topbar >
			<h3>Carica Persone Convocate</h3>
		</template>

		<form class="p-3 m-3"
			:action="'/api/events/'+event_id+'/upload/persons'"
			method='post' encType="multipart/form-data"
			ref="theForm"
			@submit.prevent="upload"
		>
			<div class="input-group">
				<input type="file" name="personsFile" 
					class="form-control"
				/>
				<div class="input-group-append">
					<button class="btn btn-success" type='submit'>Carica</button>
				</div>
			</div>
		</form>
	</BasePage>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import BasePage from './BasePage.vue'
import { sendForm } from '../libs/form-uploader'

import { Event } from '../models/Event'

const props = defineProps({
	event_id: { type: [String,Number], required: true }
});

let theForm=ref(null);
await Event.load(props.event_id);
const theEvent = Event.get_active();
const router = useRouter();

const upload = async () => {
	let result = await sendForm( theForm );
	if( result == null ) {
		console.error('Persons upload filed for event %s', props.event_id);
		alert('Caricamento Fallito');
		return;
	}
	alert( result.message || result );
	router.back();
};
</script>