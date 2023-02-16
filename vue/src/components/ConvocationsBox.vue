<template>
<div class="convocation-box"
	@dragover="dropcheck"
	@drop="dropped($event, null)"
>
	<div class="title">
		Convocati: {{ convocations.length || 'ancora nessuno'}}
		<div class="inline-bar">
			<button v-if="!read_only"
				class="btn btn-info btn-sm btn-info"
				title="aggiungi"
				@click="add_person"
			>
				<span class="bi-plus"></span>
			</button>
			<input type="text" v-model="filter" class="form-control" placeholder="filtra" />
		</div>
	</div>
	<div class="body">
		<ConvocatedPersonBox  v-for="c in unassigned" :key="c.id"
			:item="c"
			@details="$emit('details',$event)"
			:read_only="read_only"
		/>
	</div>
</div>
</template>

<script>
import { watchEffect, computed, ref } from 'vue'

import ConvocatedPersonBox from '../components/ConvocatedPersonBox.vue'
import { dropcheck, dropped } from './ConvocatedPersonBox.vue'

import { Convocation } from '../models/Convocation'

import { isEmpty } from '../libs/utils'

export default {
	components: { ConvocatedPersonBox },
	emits: ['openSearchBox','details'],
	props: {
		event_id: { type: [String,Number], default: null },
		read_only: { type: Boolean, default: false }
	},
	setup(props, context) {
		let _convocations = Convocation.all(); // reactive
		let filter = ref(null);

		const _unassigned = computed( () => {
			let cc = _convocations.value || [];
			// return cc.filter( c => c.bucket_id == null && c.status != Convocation.status.rejected );
			let ps = cc.filter( c => c.bucket_id == null );
			if( !isEmpty(filter.value) && filter.value.length >= 2 ) {
				let flt = filter.value.toLowerCase();
				ps = ps.filter( c => c.last_name.toLowerCase().indexOf(flt) >= 0 
						|| c.first_name.toLowerCase().indexOf(flt) >= 0 );
			}
			return ps.sort( (a,b) => {
				return a.last_name > b.last_name ? 1 :
					a.last_name < b.last_name ? -1 :
					a.first_name > b.first_name ? 1 :
					a.first_name < b.first_name ? -1 : 0;
			});
		});


		const add_person = async () => {
			console.log( 'Adding person' );
			context.emit('openSearchBox');
		}


		watchEffect( async () => {
			// console.log( 'watch effect');
			if( props.event_id != null ) {
				console.log( 'Loading convocations for event %s...', props.event_id );
				await Convocation.load( props.event_id );
			}
			else {
				Convocation.clear();
			}
		});


		return {
			convocations: _convocations,
			unassigned: _unassigned,
			filter,
			add_person,
			dropcheck, dropped
		}
	}
}
</script>

<style scoped lang="scss">
.convocation-box {
	// height: 4rem;
	width: 100%;
	border: 2px solid var(--fifth-col);
	margin-bottom: 1rem;
	border-radius: var(--bs-border-radius);
	padding: 1rem;

	.title {
		border-bottom: 1px solid var(--fourth-col);
		padding-bottom: 0.35rem;
		padding-left: 0.35rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.inline-bar {
			display: flex;
			flex-direction: row;
			gap: 0.3rem;
		}
	}

	.body {
		max-height: 10rem;
		overflow-y: auto;
	}
}
</style>