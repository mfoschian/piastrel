<template>
<div class="convocation-box"
	@dragover="dropcheck"
	@drop="dropped($event, null)"
>
	<div class="title">
		Convocati: {{ convocations.length || 'ancora nessuno'}}
		<button v-if="!read_only"
			class="btn btn-info btn-sm btn-info"
			title="aggiungi"
			@click="add_person"
		>
			<span class="bi-plus"></span>
		</button>
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
import { watchEffect, computed } from 'vue'

import ConvocatedPersonBox from '../components/ConvocatedPersonBox.vue'
import { dropcheck, dropped } from './ConvocatedPersonBox.vue'

import { Convocation } from '../models/Convocation'

export default {
	components: { ConvocatedPersonBox },
	props: {
		event_id: { type: [String,Number], default: null },
		read_only: { type: Boolean, default: false }
	},
	setup(props, context) {
		let _convocations = Convocation.all(); // reactive

		const _unassigned = computed( () => {
			let cc = _convocations.value || [];
			// return cc.filter( c => c.bucket_id == null && c.status != Convocation.status.rejected );
			return cc.filter( c => c.bucket_id == null );
		});

		const add_person = async () => {
			console.log( 'Adding person' );
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
	}	
}
</style>