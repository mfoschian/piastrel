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

		<div class="form-group form-section">Dettagli evento</div>

		<div class="form-group">
			<label>Protocollo (data)</label>
			<input type="date"
				v-model="protocol_dt"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Protocollo (numero)</label>
			<input type="text"
				v-model="protocol_nr"
				class="form-control"
			/>
		</div>

		<div class="form-group">
			<label>Verbale (data)</label>
			<input type="date"
				v-model="document_dt"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Verbale (numero)</label>
			<input type="text"
				v-model="document_nr"
				class="form-control"
			/>
		</div>


		<div class="form-group">
			<label>Presentarsi</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-it.png">
					</span>
				</div>
				<input type="text"
					v-model="appointment_dt_it"
					:class="{'is-invalid': !valid_appointment_dt_it}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Presentarsi (Slo)</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-slo.png">
					</span>
				</div>
				<input type="text"
					v-model="appointment_dt_slo"
					:class="{'is-invalid': !valid_appointment_dt_slo}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Operazioni di votazione</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-it.png">
					</span>
				</div>
				<input type="text"
					v-model="range_it"
					:class="{'is-invalid': !valid_range_it}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Operazioni di votazione (Slo)</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-slo.png">
					</span>
				</div>
				<input type="text"
					v-model="range_slo"
					:class="{'is-invalid': !valid_range_slo}"
					class="form-control"
				/>
			</div>
		</div>

		<div class="form-group form-section">Responsabile firmatario</div>

		<div class="form-group">
			<label>Cognome</label>
			<input type="text"
				v-model="sgn_last_name"
				:class="{'is-invalid': !valid_sgn_last_name}"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Nome</label>
			<input type="text"
				v-model="sgn_first_name"
				:class="{'is-invalid': !valid_sgn_first_name}"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label>Titolo</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-it.png">
					</span>
				</div>
				<input type="text"
					v-model="sgn_title_it"
					:class="{'is-invalid': !valid_sgn_title_it}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>Titolo (Slo)</label>
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text flag">
						<img src="../../assets/flag-slo.png">
					</span>
				</div>
				<input type="text"
					v-model="sgn_title_slo"
					:class="{'is-invalid': !valid_sgn_title_slo}"
					class="form-control"
				/>
			</div>
		</div>
		<div class="form-group">
			<label>File con firma</label>
			<input type="text"
				v-model="sign_img"
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
import { isEmpty } from '../../libs/utils'

export default {
	props: {
		event: { type: Object, required: true }
	},
	emits: [ 'save', 'cancel' ],
	setup(props,context) {
		let info = props.event.info || {};
		let protocol = info.protocol || {};
		let document = info.document || {};
		let it_info = info.it || {};
		let slo_info = info.slo || {};
		let signer = info.signer || {};
		let event = {
			id: ref( props.event.id),
			title: ref(props.event.title || ""),
			title_slo: ref(props.event.title_slo || ""),
			date: ref(props.event.date),
			active: ref(!!props.event.active),
			protocol_dt: ref(protocol.dt),
			protocol_nr: ref(protocol.number),
			document_dt: ref(document.dt),
			document_nr: ref(document.number),
			appointment_dt_it: ref(it_info.appointment_dt),
			appointment_dt_slo: ref(slo_info.appointment_dt),
			range_it: ref(it_info.range),
			range_slo: ref(slo_info.range),
			sgn_first_name: ref(signer.first_name),
			sgn_last_name: ref(signer.last_name),
			sgn_title_it: ref(signer.title_it),
			sgn_title_slo: ref(signer.title_slo),
			sign_img: ref(signer.sign)
		};

		let valid_title = computed( () => !isEmpty(event.title.value) );
		let valid_date = computed( () => !isEmpty(event.date.value) );

		let valid_appointment_dt_it = computed( () => !isEmpty(event.appointment_dt_it.value) );
		let valid_appointment_dt_slo = computed( () => !isEmpty(event.appointment_dt_slo.value) );
		let valid_appointment = computed( () => valid_appointment_dt_it.value && valid_appointment_dt_slo.value );

		let valid_range_it = computed( () => !isEmpty(event.range_it.value) );
		let valid_range_slo = computed( () => !isEmpty(event.range_slo.value) );
		let valid_range = computed( () => valid_range_it.value && valid_range_slo.value );

		let valid_sgn_first_name = computed( () => !isEmpty(event.sgn_first_name.value) );
		let valid_sgn_last_name = computed( () => !isEmpty(event.sgn_last_name.value) );
		let valid_sgn_title_it = computed( () => !isEmpty(event.sgn_title_it.value) );
		let valid_sgn_title_slo = computed( () => !isEmpty(event.sgn_title_slo.value) );
		let valid_signer = computed( () => valid_sgn_first_name.value && valid_sgn_last_name.value
			&& valid_sgn_title_it.value && valid_sgn_title_slo.value
		);

		let valid = computed( () => valid_title.value && valid_date.value 
			&& valid_appointment.value && valid_range.value && valid_signer.value
		);

		let changed = computed( () => {
			if( props.event.id != event.id.value ) return true;
			if( props.event.title != event.title.value ) return true;
			if( props.event.title_slo != event.title_slo.value ) return true;
			if( props.event.date != event.date.value ) return true;
			if( props.event.active != event.active.value ) return true;
			if( event.protocol_dt.value != protocol.dt ) return true;
			if( event.protocol_nr.value != protocol.number ) return true;
			if( event.document_dt.value != document.dt ) return true;
			if( event.document_nr.value != document.number ) return true;
			if( event.appointment_dt_it.value != it_info.appointment_dt ) return true;
			if( event.appointment_dt_slo.value != slo_info.appointment_dt ) return true;
			if( event.range_it.value != it_info.range ) return true;
			if( event.range_slo.value != slo_info.range ) return true;
			if( event.sgn_first_name.value != signer.first_name ) return true;
			if( event.sgn_last_name.value != signer.last_name ) return true;
			if( event.sgn_title_it.value != signer.title_it ) return true;
			if( event.sgn_title_slo.value != signer.title_slo ) return true;
			if( event.sign_img.value != signer.sign ) return true;

			return false;
		});

		let is_new_record = computed( () => event.id.value == null );
		let save_enabled = computed( () => valid.value && (changed.value || is_new_record.value)  );

		watchEffect(() => {
			event.id.value = props.event.id;
			event.title.value = props.event.title;
			event.title_slo.value = props.event.title_slo;
			event.date.value = props.event.date;
			event.active.value = !!props.event.active;

			info = props.event.info || {};
			protocol = info.protocol || {};
			document = info.document || {};
			it_info = info.it || {};
			slo_info = info.slo || {};
			signer = info.signer || {};
			event.protocol_dt.value = protocol.dt;
			event.protocol_nr.value = protocol.number;
			event.document_dt.value = document.dt;
			event.document_nr.value = document.number;
			event.appointment_dt_it.value = it_info.appointment_dt;
			event.appointment_dt_slo.value = slo_info.appointment_dt;
			event.range_it.value = it_info.range;
			event.range_slo.value = slo_info.range;
			event.sgn_first_name.value = signer.first_name;
			event.sgn_last_name.value = signer.last_name;
			event.sgn_title_it.value = signer.title_it;
			event.sgn_title_slo.value = signer.title_slo;
			event.sign_img.value = signer.sign;
		});

		const save = async () => {
			let ev = {
				id: event.id.value,
				title: event.title.value,
				title_slo: event.title_slo.value,
				date: event.date.value,
				active: event.active.value,
				info: {
					protocol: {
						dt: event.protocol_dt.value,
						number: event.protocol_nr.value
					},
					document: {
						dt: event.document_dt.value,
						number: event.document_nr.value
					},
					it: {
						appointment_dt : event.appointment_dt_it.value,
						range: event.range_it.value
					},
					slo: {
						appointment_dt : event.appointment_dt_slo.value,
						range: event.range_slo.value
					},
					signer: {
						first_name: event.sgn_first_name.value,
						last_name: event.sgn_last_name.value,
						title_it: event.sgn_title_it.value,
						title_slo: event.sgn_title_slo.value,
						sign: event.sign_img.value
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
			valid_appointment_dt_it, valid_appointment_dt_slo, // valid_appointment,
			valid_range_it, valid_range_slo, // valid_range,
			valid_sgn_first_name, valid_sgn_last_name, valid_sgn_title_it, valid_sgn_title_slo, // valid_signer,
			valid, save_enabled,
			changed
		};
	}
}
</script>
