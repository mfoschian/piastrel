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
	emits: ['cancel', 'saveStatus' ],
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
			let cts = await Person.contactsOf(props.item.person_id);
			for( let i=0; i<knownContacts.length; i++) {
				let k = knownContacts[i];
				contactsH[k].value = getContactValue(cts, k);
			}
			contacts.value = cts;
		});

		// let save_enabled = ref(false);
		// const changeStatus = () => {
		// 	save_enabled.value = (props.item.status!= status.value || contact_changed.value == true);
		// 	console.log('status: %s -> %s', props.item.status, status.value);
		// };
		let status_changed = computed( () => props.item.status != status.value );
		let save_enabled = computed( () => {
			return (status_changed.value == true || contact_changed.value == true);
		});

		const save = async () => {
			if( props.read_only )
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

			if( status_changed.value == true )
				context.emit('saveStatus', status.value);
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
			// changeStatus,
			save_enabled,
			save, cancel,
			getPdf,
			// updateContact,
			// addNewContact,
			// deleteContact
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