<template>
	<form>
		<div class="form-group">
			<label>Nome</label>
			<input type="text"
				v-model="title"
				:class="{'is-invalid': !valid_title}"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Data</label>
			<input type="date"
				v-model="date"
				:class="{'is-invalid': !valid_date}"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Attivo?</label><br>
			<input type="checkbox"
			v-model="active"
			class="form-check-input"
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
		event: { type: Object, required: true }
	},
	emits: [ 'save', 'cancel' ],
	setup(props,context) {
		let event = {
			id: ref( props.event.id),
			title: ref(props.event.title || ""),
			date: ref(props.event.date),
			active: ref(!!props.event.active)
		};

		let valid_title = computed( () => !empty(event.title.value) );
		let valid_date = computed( () => !empty(event.date.value) );
		let valid = computed( () => valid_title.value && valid_date.value );
		let save_enabled = computed( () => valid.value && changed.value  );

		let changed = computed( () => {
			if( props.event.id != event.id.value ) return true;
			if( props.event.title != event.title.value ) return true;
			if( props.event.date != event.date.value ) return true;
			if( props.event.active != event.active.value ) return true;
			return false;
		});

		watchEffect(() => {
			event.id.value = props.event.id;
			event.title.value = props.event.title;
			event.date.value = props.event.date;
			event.active.value = !!props.event.active;
		});

		const save = async () => {
			let ev = {
				id: event.id.value,
				title: event.title.value,
				date: event.date.value,
				active: event.date.value
			};

			context.emit('save', ev);		
		};

		const cancel = () => {
			// reset(); // ?
			context.emit('cancel');
		};

		return {
			...event,
			save, cancel,
			valid_title,
			valid_date,
			valid, save_enabled,
			changed
		};
	}
}
</script>