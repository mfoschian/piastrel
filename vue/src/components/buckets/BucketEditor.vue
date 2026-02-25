<template>
	<form @submit.prevent >
		<div class="form-group">
			<label>Numero</label>
			<input type="text"
				v-model="bucket_number"
				:class="{'is-invalid': !valid_number}"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Nome</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-it.png">
					</span>
				</div>
				<input type="text"
					v-model="bucket_name"
					:class="{'is-invalid': !valid_name}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Nome (Slo)</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-slo.png">
					</span>
				</div>
				<input type="text"
					v-model="bucket_name_slo"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Indirizzo</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-it.png">
					</span>
				</div>
				<input type="text"
					v-model="bucket_address"
					:class="{'is-invalid': !valid_address}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Indirizzo (Slo)</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-slo.png">
					</span>
				</div>
				<input type="text"
					v-model="bucket_address_slo"
					:class="{'is-invalid': !valid_address}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="buttons">
			<button @click="save" class="btn btn-danger" :disabled="!save_enabled">Salva</button>
			<button @click="cancel" class="btn btn-secondary">Annulla</button>
		</div>
	</form>
</template>

<script setup>
import { computed } from '@vue/reactivity';
import { ref, watchEffect } from 'vue'
import { isEmpty } from '../../libs/utils'

const props = defineProps({
	bucket: { type: Object, required: true }
});

const emit = defineEmits([ 'save', 'cancel' ]);

let bucket_id = ref( props.bucket.id);
let bucket_number = ref(props.bucket.number || 0);
let bucket_name = ref(props.bucket.name || "");
let bucket_address = ref(props.bucket.address || "");
let bucket_name_slo = ref(props.bucket.name_slo || "");
let bucket_address_slo = ref(props.bucket.address_slo || "");

let valid_name = computed( () => !isEmpty(bucket_name.value) );
let valid_number = computed( () => !isEmpty(bucket_number.value) );
let valid_address = computed( () => true );
let valid = computed( () => valid_name.value && valid_number.value && valid_address.value );
let is_new_record = computed( () => bucket_id.value == null );
let save_enabled = computed( () => valid.value && (changed.value || is_new_record.value)  );

let changed = computed( () => {
	if( props.bucket.id != bucket_id.value ) return true;
	if( props.bucket.number != bucket_number.value ) return true;
	if( props.bucket.name != bucket_name.value ) return true;
	if( props.bucket.address != bucket_address.value ) return true;
	if( props.bucket.name_slo != bucket_name_slo.value ) return true;
	if( props.bucket.address_slo != bucket_address_slo.value ) return true;
	return false;
});

watchEffect(() => {
	bucket_id.value = props.bucket.id;
	bucket_number.value = props.bucket.number;
	bucket_name.value = props.bucket.name;
	bucket_address.value = props.bucket.address;
	bucket_name_slo.value = props.bucket.name_slo;
	bucket_address_slo.value = props.bucket.address_slo;
});

const save = async () => {
	let x = {
		id: bucket_id.value,
		number: bucket_number.value,
		name: bucket_name.value,
		address: bucket_address.value,
		name_slo: bucket_name_slo.value,
		address_slo: bucket_address_slo.value
	};

	emit('save', x);		
};

const cancel = () => {
	// reset(); // ?
	emit('cancel');
};

</script>