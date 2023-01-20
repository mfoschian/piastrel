<template>
	<div class="form-group row align-items-center" v-if="!editmode">
		<label class="col-sm-3 col-form-label">
			<button class="btn btn-warning btn-sm m-2">
				<span class="bi-pencil" @click="editmode=true"></span>
			</button>
			{{label}}:
		</label>
		<div class="col-sm-9">
			{{ value }}
		</div>
	</div>
	<div class="form-group row align-items-center" v-else>
		<div class="col-sm-1">
			<button class="btn btn-danger btn-sm m-2">
				<span class="bi-save" @click="saveContact"></span>
			</button>
		</div>
		<label class="col-sm-2 col-form-label">
			<select v-model="type" class="form-select">
				<option v-for="(v,k) in contact_labels" :value="k">{{ v }}</option>
			</select>
		</label>
		<div class="col-sm-8">
			<input type="text" class="form-control" v-model="value" >
		</div>
		<div class="col-sm-1">
			<button class="btn btn-danger btn-sm m-2">
				<span class="bi-trash" @click="deleteContact"></span>
			</button>
		</div>
	</div>

</template>

<script>
import { ref, computed } from 'vue'

const contact_labels = {
	phone: 'Telefono',
	address: 'Indirizzo',
	cap: 'Cap',
	municipality: 'Comune'
};

export default {
	props: {
		item: { type: Object, required: true }
	},
	emits: ['save','delete'],
	setup(props, context) {
		let value = ref(props.item.value);
		let type = ref(props.item.type);
		let label = computed( () => contact_labels[type.value] );
		let editmode = ref(props.item.id == null);

		const saveContact = () => {
			if( value.value != props.item.value || type.value != props.item.type ) {
				context.emit('save', {
					id: props.item.id,
					person_id: props.item.person_id,
					type: type.value,
					value: value.value
				});
			}
			editmode.value = false;
		};

		const deleteContact = () => {
			let ok = confirm('Cancello il contatto '+value.value+' ?');
			if( ok != true )
				return;

			context.emit('delete', { id: props.item.id, person_id: props.item.person_id } );
			editmode.value = false;
		};

		return {
			label,
			value,
			type,
			editmode,
			contact_labels,
			saveContact, deleteContact
		}
	},
	computed: {
		label() {
			return contact_labels[this.item.type] || '?';
		}
	}
}


</script>