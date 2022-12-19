<template>
	<div class="container">
		<div class="row mb-2">
			<div class="col-3">Cerca: </div>
			<div class="col">
				<!-- <input type="text" @input="search" v-model="text"> -->
				<input type="text" v-model="text">
			</div>
		</div>

		<div class="results row" v-for="item in results" :class="{choosed: item.choosed}">
			<div class="col">
				{{ item.last_name }} {{ item.first_name }}
			</div>
			<div class="col">
				{{ item.code }}
			</div>
			<div class="col action">
				<button :disabled="item.choosed"
					class="btn btn-success sm"
					title="Aggiungi"
					@click="selectPerson(item)"
				>
					<span class="bi bi-plus"></span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import {Person} from '../models/Person'
import {Convocation} from '../models/Convocation'

// let props = defineProps({
// 	exclude: { type: Array, default: () => [] }
// });

let results = ref([]);
let text = ref('');
let _convs = Convocation.all();
let alreadySelected = computed( () => {
	return _convs.value.map( x => x.code );
});

// const search = async () => {
watchEffect( async () => {
	if( text.value.length >= 1 ) {
		let items = await Person.search( text.value ) || [];
		items = items.map( x => ({ ...x, choosed: (alreadySelected.value.indexOf(x.code) >= 0) }));
		results.value = items;
	}
	else {
		results.value = [];
	}
});

const emit = defineEmits(['selected']);
function selectPerson(p) {
	if( alreadySelected.value.indexOf(p.code) < 0)
		emit('selected', p);
	else
		alert('Persona già presente');
}
</script>

<style lang="scss" scoped>
.results.row {
	padding: 0.3rem;
	margin-right: 0.5rem;
	border-top: 1px solid black;
	border-left: 1px solid black;
	border-right: 1px solid black;

	.action {
		text-align: right;
	}

	&:last-child {
		border-bottom: 1px solid black;
	}
}
</style>