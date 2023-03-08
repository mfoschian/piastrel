<template>
	<form @submit.prevent @keydown.enter.prevent >
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
					:disabled="read_only"
				>
					<option value="convocated">Invitato</option>
					<option value="contacted">Contattato</option>
					<option value="accepted">Accettato</option>
					<option value="rejected">Non Accettato</option>
					<option value="confirmed">Accettato e Confermato</option>
				</select>
			</div>
		</div>
		<div class="form-group row">
			<label class="col-sm-4 col-form-label">Documento Conferma Scrutatore</label>
			<div class="col-sm-8">
				<input type="text" class="form-control"
					placeholder="protocollo"
					:disabled="read_only"
					v-model="doc_number"
				>				
				<input type="date" class="form-control"
					placeholder="data doc"
					:disabled="read_only"
					v-model="doc_dt" 
				>
				<button class="btn btn-success pdf-btn" @click="getPdf"><span class="bi bi-filetype-pdf"></span></button>
				<!-- <span class="bi bi-file-pdf"></span> -->
			</div>
		</div>

		<div class="form-group form-section">Note</div>
		<textarea v-model="note" class="form-control"></textarea>

		<div class="form-group form-section">Contatti<span v-if="contact_changed"> *</span></div>
		<div class="contact-table container">
			<div class="row">
				<div class="col-2 col-form-label">Telefono</div>
				<div class="col"><input type="text" v-model="phone" class="form-control" :disabled="read_only"/></div>
			</div>
			<div class="row">
				<div class="col-2 col-form-label">Indirizzo</div>
				<div class="col"><input type="text" v-model="address" class="form-control" :disabled="read_only"/></div>
			</div>
			<div class="row">
				<div class="col-2 col-form-label">CAP</div>
				<div class="col"><input type="text" v-model="cap" class="form-control" :disabled="read_only"/></div>
			</div>
			<div class="row">
				<div class="col-2 col-form-label">Comune</div>
				<div class="col"><input type="text" v-model="municipality" class="form-control" :disabled="read_only"/></div>
			</div>
		</div>

		<div class="buttons">
			<button @click="save" class="btn btn-danger" :disabled="(!save_enabled || read_only)">Salva</button>
			<button @click="cancel" class="btn btn-secondary">Annulla</button>
		</div>
	</form>
</template>

<script>
import { ref, computed, watchEffect } from 'vue'
import { Convocation } from '../models/Convocation';
import { Bucket } from '../models/Bucket';
import { Person } from '../models/Person';
// import ContactBox from '../components/ContactBox.vue';
import { isEmpty } from '../libs/utils';

export default {
	// components: {ContactBox},
	props: {
		item: { type: Object, required: true },
		read_only: { type: Boolean, default: false },
	},
	emits: ['cancel', 'saveConvocation' ],
	setup(props, context) {

		let status = ref(props.item.status);
		let bucket_id = ref(null);
		let bucket_name = computed( () => {
			let b = Bucket.get(bucket_id.value) || {};
			if( !b || !b.number ) return 'Nessuna';
			let s = 'N. ' + b.number + ' - ' + b.name;
			if( b.name_slo )
				s += '/' + b.name_slo;
			return s;
		});

		let doc_number = ref(null);
		let doc_dt = ref(null);
		const doc_changed = computed( () => doc_number.value != props.item.doc_number
			|| doc_dt.value != props.item.doc_dt
		);

		let note = ref(null);
		const note_changed = computed( () => note.value != props.item.note );

		let contacts = ref([]);
		const getContactValue = (cts ,type) => {
			let c = cts.filter( c => c.type == type)[0];
			if( c == null ) return null;
			return c.value;
		};
		let contactsH = {
			phone: ref(null),
			address: ref(null),
			cap: ref(null),
			municipality: ref(null)
		};
		const knownContacts = Object.keys(contactsH);
		const contact_changed = computed( () => {
			for( let i=0; i<knownContacts.length; i++) {
			 	let k = knownContacts[i];
			 	let newValue = contactsH[k].value;
			 	let oldValue = getContactValue(contacts.value, k);
				if( newValue != oldValue ) 
					return true;
			}
			return false;
		});

		watchEffect( async () => {
			status.value = props.item.status;
			bucket_id.value = props.item.bucket_id;
			doc_number.value = props.item.doc_number;
			doc_dt.value = props.item.doc_dt;
			note.value = props.item.note;
			let cts = await Person.contactsOf(props.item.person_id);
			for( let i=0; i<knownContacts.length; i++) {
				let k = knownContacts[i];
				contactsH[k].value = getContactValue(cts, k);
			}
			contacts.value = cts;
		});


		let status_changed = computed( () => props.item.status != status.value );
		let save_enabled = computed( () => {
			return (status_changed.value == true
				|| contact_changed.value == true
				|| doc_changed.value == true
				|| note_changed.value == true
			);
		});

		const save = async () => {
			if( props.read_only || save_enabled.value != true )
				return;

			// Save contacts changes
			if( contact_changed.value == true ) {
				try {
					let new_contacts = [];
					for( let i=0; i<knownContacts.length; i++ ) {
						let k = knownContacts[i];
						let newVal = contactsH[k].value;
						let c = contacts.value.filter( x => x.type == k )[0];
						if( !c && !isEmpty(newVal) ) {
							// Add
							c = {
								id: null,
								person_id: props.item.person_id,
								type: k,
								value: newVal
							};
							console.log('Adding contact: %s - %s', c.type, c.value);
							let res = await Person.saveContact(c);
							console.log(res);
							new_contacts.push( res );
						}
						else if( c && !isEmpty(c.value) && isEmpty(newVal) ) {
							// Delete
							console.log('Deleting contact %s: %s - %s', c.id, c.type, c.value);
							let res = await Person.deleteContact(c);
							console.log(res);
						}
						else if( c && c.value != newVal ) {
							// Update
							c.value = newVal;
							console.log('Updating contact %s: %s <- %s', c.id, c.type, c.value);
							let res = await Person.saveContact(c);
							console.log(res);
							new_contacts.push( res )
						}
					}
					contacts.value = new_contacts;
				}
				catch(err) {
					console.error( 'Failed to save contacts' );
					console.log( err );
				}
			}

			let c = {};
			
			if( status_changed.value == true ) {
				c.status = status.value;
			}
			if( doc_changed.value == true ) {
				c.doc_dt = doc_dt.value;
				c.doc_number = doc_number.value;
			}
			if( note_changed.value == true ) {
				c.note = note.value;
			}
			context.emit('saveConvocation', c);
		};

		const cancel = () => {
			if( contact_changed.value == true ) {
				for( let i=0; i<knownContacts.length; i++) {
					let k = knownContacts[i];
					contactsH[k].value = getContactValue(contacts.value, k);
				}
			}
			context.emit('cancel');
		};

		const getPdf = () => {
			if( bucket_id.value == null ) {
				alert( 'La persona non è assegnata a nessuna sezione');
				return;
			}
			
			let url = Convocation.confirmPdfUrl(props.item.id);
			window.open(url,'_blank');
		};




		// const addNewContact = () => {
		// 	contacts.value.push({
		// 		id: null,
		// 		person_id: props.item.person_id,
		// 		type: 'phone',
		// 		value: ''
		// 	});
		// };

		return {
			status,
			bucket_name,
			contacts,
			...contactsH, contact_changed,
			doc_dt, doc_number, note,
			save_enabled,
			save, cancel,
			getPdf,
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

.contact-table {
	.row {
		margin-bottom: 0.5rem;
	}
}
</style>