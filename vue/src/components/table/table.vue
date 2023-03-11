<template>
	<table class="table">
		<thead>
			<tr>
				<th v-for="col in columns" :key="col.id"
					@click="handleSortOf(col)"
					:class="{
						sortable: col.sortable,
						sorted: col.sortable && col.id == sort_field,
						asc: col.sortable && col.id == sort_field && sort_asc,
						desc: col.sortable && col.id == sort_field && !sort_asc,
					}"
				>
					{{ col.label || col.name }}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(row,ix) in sorted_rows" :key="ix">
				<td v-for="col in columns" :key="col.id">
					<slot :name="`cell[${col.id}]`" :row="row">{{  row[col.id] }}</slot>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	columns: { type: Object, required: true },
	rows: { type: Array, required: true },
	sort_field: { type: String, default: null },
	sort_asc: { type: Boolean, default: true }
});

const emit = defineEmits(['sortby', 'filterby']);

let sort_field = ref( props.sort_field );
let sort_asc = ref( props.sort_asc );

const default_sort = (b1,b2) => {
	const v1 = b1[sort_field.value];
	const v2 = b2[sort_field.value];

	return v1 > v2 ? 1 : v1 < v2 ? -1 : 0;
};

function calc_sort_function(field, asc) {
	let col_def = props.columns.filter( c => c.id == field )[0];
	let res = default_sort;
	if( col_def && col_def.sort )
		res = col_def.sort;

	if( asc == true )
		return res;

	return (a,b) => -res(a,b);
}

let sort_function = ref(calc_sort_function(props.sort_field, props.sort_asc));

let sorted_rows = computed( () => {
	if( sort_function.value == null )
		return props.rows;

	return [].concat( props.rows ).sort( sort_function.value );
});


const handleSortOf = ( col ) => {
	if(col.sortable) {
		if( col.id == sort_field.value ) {
			sort_asc.value = !sort_asc.value;
		}
		else {
			sort_field.value = col.id;
			sort_asc.value = true;
		}

		sort_function.value = calc_sort_function(sort_field.value, sort_asc.value);
	}
}
</script>

<style lang="scss" scoped>
table {
	font-size: 1.2rem;

	thead {
		tr {
			background-color: var(--fifth-col);
			color: var(--fifth-text-col);


			th.sortable {
				cursor: pointer;

				&.sorted.asc::after {
					content: ' ^'
				}
				&.sorted.desc::after {
					content: ' v'
				}
			}
		}
	}

	tbody {
		tr:nth-child(2n) {
			background-color: var(--second-col);
		}
	}
}
</style>