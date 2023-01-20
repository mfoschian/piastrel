<template>
	<form @submit.prevent>
		<div class="form-group">
			<label>Nome</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-it.png">
					</span>
				</div>
				<input type="text"
					v-model="title"
					:class="{'is-invalid': !valid_title}"
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
					v-model="title_slo"
					class="form-control"
				/>
			</div>
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
import { isEmpty } from '../../libs/utils'

export default {
	props: {
		event: { type: Object, required: true }
	},
	emits: [ 'save', 'cancel' ],
	setup(props,context) {
		let event = {
			id: ref( props.event.id),
			title: ref(props.event.title || ""),
			title_slo: ref(props.event.title_slo || ""),
			date: ref(props.event.date),
			active: ref(!!props.event.active)
		};

		let valid_title = computed( () => !isEmpty(event.title.value) );
		let valid_date = computed( () => !isEmpty(event.date.value) );
		let valid = computed( () => valid_title.value && valid_date.value );
		let is_new_record = computed( () => event.id.value == null );
		let save_enabled = computed( () => valid.value && (changed.value || is_new_record.value)  );

		let changed = computed( () => {
			if( props.event.id != event.id.value ) return true;
			if( props.event.title != event.title.value ) return true;
			if( props.event.title_slo != event.title_slo.value ) return true;
			if( props.event.date != event.date.value ) return true;
			if( props.event.active != event.active.value ) return true;
			return false;
		});

		watchEffect(() => {
			event.id.value = props.event.id;
			event.title.value = props.event.title;
			event.title_slo.value = props.event.title_slo;
			event.date.value = props.event.date;
			event.active.value = !!props.event.active;
		});

		const save = async () => {
			let ev = {
				id: event.id.value,
				title: event.title.value,
				title_slo: event.title_slo.value,
				date: event.date.value,
				active: event.active.value,
				info: {
					it: {
						appointment_dt : '16.00 di sabato, 24 settembre 2022',
						range: 'dalle ore 7.00 alle ore 23.00 di domenica 25 settembre'
					},
					slo: {
						appointment_dt : 'v soboto, 24.septembra 2022, ob 16. uri',
						range: 'v nedeljo, 25. septembra 2022, od 7. do 23. ure'
					},
					signer: {
						first_name: 'Nome (mancante)',
						last_name: 'Cognome (mancante)',
						title_it: "Titolo Responsabile (mancante)",
						title_slo: 'Titolo Responsabile slo (mancante)',
						sign: 'image-asset-name'
					}
				}
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
