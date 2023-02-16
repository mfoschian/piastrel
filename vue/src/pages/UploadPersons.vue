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
			<input type="file" name="personsFile" 
				class="form-control"
				@change="fileChanged($event)"
			/>

			<div class="input-group">
				<div class="input-group-prepend"><span class="input-group-text">Separatore</span></div>
				<input type="text" size="3" name="separator"
					class="form-control"
					v-model="separator"
				/>
			</div>

			<button class="btn btn-success"
				type="submit"
				:disabled="!validFile"
			>Carica</button>
			
		</form>
	</BasePage>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import BasePage from './BasePage.vue'
import { sendForm } from '../libs/form-uploader'

import { Event } from '../models/Event'
import { isEmpty } from '../libs/utils'

const props = defineProps({
	event_id: { type: [String,Number], required: true },
	separator: { type: String, default: ';' }
});

let theForm=ref(null);
let filename=ref(null);
let separator=ref(props.separator);

const validFile=computed( () => !isEmpty(filename.value) );

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

function fileChanged(ev) {
	filename.value = ev.target.value;
}
</script>

<style scoped lang="scss">
	form {
		text-align: center;

		input {
			margin-bottom: 1em;
		}

		button {
			margin: auto;
		}
	}
</style>