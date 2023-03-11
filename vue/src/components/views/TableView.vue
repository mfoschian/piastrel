<template>
	<XTable
		:columns="fields" :rows="table_rows"
		sort_field="bucket_nr" :sort_asc="true"
	>
		<template #cell[last_name]="{row}">
			<i>{{ row.last_name }}</i>
		</template>

		<template #cell[actions]="{row}">
			<span class="bi bi-box-arrow-up-right clickable"
				@click="$emit('details', row.person_id)"
			></span>
		</template>

		<template #cell[status]="{row}">
			{{ decode_status(row.status) }}
		</template>
	</XTable>
</template>

<script setup>
import { Bucket } from '../../models/Bucket'
import { Convocation } from '../../models/Convocation'

import XTable from '../table/table.vue'

import { ref, computed } from 'vue'

const emit = defineEmits(['details', 'openSearchBox']);
const props = defineProps({
	event: { type: Object, required: true },
	read_only: { type: Boolean, default: false }
});

let buckets = Bucket.all(); // reactive
let convocations = Convocation.all(); // reactive

const bucket_nr_sorted = computed( () => {
	return buckets.value.map( b => b.number || '' ).sort( Bucket.cmp_by_number );
});

const sort_by_bucket_nr = (b1,b2) => {
	const i1 = bucket_nr_sorted.value.indexOf(b1.bucket_nr);
	const i2 = bucket_nr_sorted.value.indexOf(b2.bucket_nr);

	return i1 - i2;
};


const fields = ref([
	{ id: 'bucket_nr', label: 'Sezione', sortable: true, sort: sort_by_bucket_nr },
	{ id: 'last_name', label: 'Cognome', sortable: true },
	{ id: 'first_name', label: 'Nome', sortable: true },
	// { id: 'code', label: 'Codice Fiscale', sortable: true },
	{ id: 'status', label: 'Stato', sortable: true },
	{ id: 'note', label: 'Note' },
	{ id: 'phone', label: 'Telefono' },
	{ id: 'actions', label: '' }
]);

const decode_status = (s) => {
	switch(s) {
		case "convocated": return 'Invitato';
		case "contacted": return 'Contattato';
		case "accepted": return 'Accettato';
		case "rejected": return 'Non Accettato';
		case "confirmed": return 'Accettato e Confermato';
	}
	return '?';
};

await Bucket.load();
await Convocation.load( props.event.id );


let table_rows = computed( () => {
	const res = convocations.value.map( c => {
		let b = Bucket.get(c.bucket_id) || {};
		let res = {
			person_id: c.person_id,
			bucket_nr: b.number,
			last_name: c.last_name,
			first_name: c.first_name,
			code: c.code,
			status: c.status,
			note: c.note,
			phone: 'todo'
		};
		return res;
	})
	return res;
});
</script>