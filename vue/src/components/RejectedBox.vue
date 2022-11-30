<template>
<div class="rejected-box"
	@dragover="dropcheck"
	@drop="drop_and_reject($event)"
>
	<div class="title">
		Rinunce: {{ rejected.length }}
	</div>
	<div class="body">
		<ConvocatedPersonBox  v-for="c in rejected" :key="c.id" :item="c" @details="$emit('details',$event)"/>
	</div>
</div>
</template>

<script>
import { watchEffect, computed } from 'vue'

import ConvocatedPersonBox from '../components/ConvocatedPersonBox.vue'
import { dropcheck, dropped } from './ConvocatedPersonBox.vue'

import { Convocation, Stats } from '../models/Convocation'

export default {
	components: { ConvocatedPersonBox },
	props: {
		// event_id: { type: [String,Number], required: true }
	},
	setup(props, context) {
		let _convocations = Convocation.all(); // reactive

		const drop_and_reject = (ev) => {
			return dropped(ev,null,Convocation.status.rejected);
		};

		return {
			rejected: Stats.rejected,
			dropcheck, drop_and_reject
		}
	}
}
</script>

<style scoped lang="scss">
.rejected-box {
	// height: 4rem;
	width: 100%;
	border: 2px solid var(--bs-danger);
	margin-bottom: 1rem;
	border-radius: var(--bs-border-radius);
	padding: 1rem;

	.title {
		border-bottom: 1px solid var(--bs-danger);
		padding-bottom: 0.35rem;
		padding-left: 0.35rem;
	}	
}
</style>