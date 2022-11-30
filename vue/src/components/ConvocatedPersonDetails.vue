<template>
	<form>
		<div class="form-group">
			<label>Cognome</label>
			<input type="text"
				:value="item.last_name"
				disabled="true"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Nome</label>
			<input type="text"
				:value="item.first_name"
				disabled="true"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Sezione</label>
			<input type="text"
				:value="bucket_name"
				disabled="true"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Stato Convocazione</label>
			<select
				v-model="status"
				class="form-control"
				@change="changeStatus"
			>
				<option value="convocated">Invitato</option>
				<option value="accepted">Accettato</option>
				<option value="rejected">Non Accettato</option>
				<option value="confirmed">Accettato e Confermato</option>
			</select>
		</div>
		<div class="buttons">
			<button @click="save" class="btn btn-danger" :disabled="!save_enabled">Salva</button>
			<button @click="$emit('cancel')" class="btn btn-secondary">Annulla</button>
		</div>
	</form>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import { Convocation } from '../models/Convocation';
import { Bucket } from '../models/Bucket';

export default {
	props: {
		item: { type: Object, required: true }
	},
	emits: ['cancel', 'saveStatus' ],
	setup(props, context) {

		let status = ref(props.item.status);
		let bucket_id = ref(null);
		let bucket_name = computed( () => {
			let b = Bucket.get(bucket_id.value) || {};
			return b.name || "Nessuna";
		});

		watchEffect( () => {
			status.value = props.item.status;
			bucket_id.value = props.item.bucket_id;
		});

		let save_enabled = ref(false);
		const changeStatus = () => {
			save_enabled.value = (props.item.status!= status.value);
			console.log('status: %s -> %s', props.item.status, status.value);
		};

		const save = () => {
			let new_status = status.value;
			context.emit('saveStatus', new_status);
		};

		return {
			status,
			bucket_name,
			changeStatus,
			save_enabled,
			save
		};
	}
}

</script>

<style lang="scss">

</style>