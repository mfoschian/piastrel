<template>
	<form>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Cognome:</label>
			<div class="col-sm-8">
				<input type="text"
					readonly
					:value="item.last_name"
					disabled="true"
					class="form-control-plaintext"
				/>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Nome:</label>
			<div class="col-sm-8">
				<input type="text"
					readonly
					:value="item.first_name"
					disabled="true"
					class="form-control-plaintext"
				/>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Codice Fiscale</label>
			<div class="col-sm-8">
				<input type="text"
					readonly
					:value="item.code"
					disabled="true"
					class="form-control-plaintext"
				/>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Sezione</label>
			<div class="col-sm-8">
				<input type="text"
					readonly
					:value="bucket_name"
					disabled="true"
					class="form-control-plaintext"
				/>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Stato Convocazione</label>
			<div class="col-sm-8">
				<select
					v-model="status"
					class="form-control"
					@change="changeStatus"
					:disabled="read_only"
				>
					<option value="convocated">Invitato</option>
					<option value="accepted">Accettato</option>
					<option value="rejected">Non Accettato</option>
					<option value="confirmed">Accettato e Confermato</option>
				</select>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Documento Conferma Scrutatore</label>
			<div class="col-sm-8">
				<button class="btn btn-success pdf-btn" @click="getPdf"><span class="bi bi-filetype-pdf"></span></button>
				<!-- <span class="bi bi-file-pdf"></span> -->
			</div>
		</div>
		<div class="buttons">
			<button @click="save" class="btn btn-danger" :disabled="(!save_enabled || read_only)">Salva</button>
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
		item: { type: Object, required: true },
		read_only: { type: Boolean, default: false },
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
			if( props.read_only )
				return;

			let new_status = status.value;
			context.emit('saveStatus', new_status);
		};

		const getPdf = () => {
			let url = Convocation.confirmPdfUrl(props.item.id);
			window.open(url,'_blank');
		};

		return {
			status,
			bucket_name,
			changeStatus,
			save_enabled,
			save,
			getPdf
		};
	}
}

</script>

<style lang="scss">
.pdf-btn {
	font-size: 1.3rem;
}

.row {
	input[readonly] {
		font-weight: bold;
	}
}
</style>