<template>
	<form>
		<div class="form-group">
			<label>Nome</label>
			<input type="text"
				v-model="name"
				:class="{'is-invalid': !valid_name}"
				class="form-control"
			/>
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
import { empty } from '../../libs/utils'

export default {
	props: {
		bucket: { type: Object, required: true }
	},
	emits: [ 'save', 'cancel' ],
	setup(props,context) {
		let bucket = {
			id: ref( props.bucket.id),
			name: ref(props.bucket.name || "")
		};

		let valid_name = computed( () => !empty(bucket.name.value) );
		let valid = computed( () => valid_name.value );
		let save_enabled = computed( () => valid.value && changed.value  );

		let changed = computed( () => {
			if( props.bucket.id != bucket.id.value ) return true;
			if( props.bucket.name != bucket.name.value ) return true;
			return false;
		});

		watchEffect(() => {
			bucket.id.value = props.bucket.id;
			bucket.name.value = props.bucket.name;
		});

		const save = async () => {
			let x = {
				id: bucket.id.value,
				name: bucket.name.value
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
			valid_name,
			valid, save_enabled,
			changed
		};
	}
}
</script>