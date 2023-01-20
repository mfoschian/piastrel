<template>
	<form @submit.prevent >
		<div class="form-group">
			<label>Numero</label>
			<input type="text"
				v-model="number"
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
					v-model="name"
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
					v-model="name_slo"
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
					v-model="address"
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
					v-model="address_slo"
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

<script>
import { computed } from '@vue/reactivity';
import { ref, watchEffect } from 'vue'
import { isEmpty } from '../../libs/utils'

export default {
	props: {
		bucket: { type: Object, required: true }
	},
	emits: [ 'save', 'cancel' ],
	setup(props,context) {
		let bucket = {
			id: ref( props.bucket.id),
			number: ref(props.bucket.number || 0),
			name: ref(props.bucket.name || ""),
			address: ref(props.bucket.address || ""),
			name_slo: ref(props.bucket.name_slo || ""),
			address_slo: ref(props.bucket.address_slo || "")
		};

		let valid_name = computed( () => !isEmpty(bucket.name.value) );
		let valid_number = computed( () => !isEmpty(bucket.number.value) );
		let valid_address = computed( () => true );
		let valid = computed( () => valid_name.value && valid_number.value && valid_address.value );
		let is_new_record = computed( () => bucket.id.value == null );
		let save_enabled = computed( () => valid.value && (changed.value || is_new_record.value)  );

		let changed = computed( () => {
			if( props.bucket.id != bucket.id.value ) return true;
			if( props.bucket.number != bucket.number.value ) return true;
			if( props.bucket.name != bucket.name.value ) return true;
			if( props.bucket.address != bucket.address.value ) return true;
			if( props.bucket.name_slo != bucket.name_slo.value ) return true;
			if( props.bucket.address_slo != bucket.address_slo.value ) return true;
			return false;
		});

		watchEffect(() => {
			bucket.id.value = props.bucket.id;
			bucket.number.value = props.bucket.number;
			bucket.name.value = props.bucket.name;
			bucket.address.value = props.bucket.address;
			bucket.name_slo.value = props.bucket.name_slo;
			bucket.address_slo.value = props.bucket.address_slo;
		});

		const save = async () => {
			let x = {
				id: bucket.id.value,
				number: bucket.number.value,
				name: bucket.name.value,
				address: bucket.address.value,
				name_slo: bucket.name_slo.value,
				address_slo: bucket.address_slo.value
			};

			context.emit('save', x);		
		};

		const cancel = () => {
			// reset(); // ?
			context.emit('cancel');
		};

		return {
			...bucket,
			save, cancel,
			valid_name, valid_number, valid_address,
			valid, save_enabled,
			changed
		};
	}
}
</script>