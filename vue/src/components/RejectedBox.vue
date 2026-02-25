<template>
<div class="rejected-box"
	@dragover="dropcheck"
	@drop="drop_and_reject($event)"
>
	<div class="title">
		Rinunce: {{ rejected.length }}
	</div>
	<div class="body">
		<ConvocatedPersonBox  v-for="c in rejected" :key="c.id"
			:item="c"
			:read_only="read_only"
			@details="$emit('details',$event)"
		/>
	</div>
</div>
</template>

<script setup>
import { watchEffect, computed } from 'vue'

import ConvocatedPersonBox from '../components/ConvocatedPersonBox.vue'
import { dropcheck, dropped } from './ConvocatedPersonBox.vue'

import { Convocation, Stats } from '../models/Convocation'

const props = defineProps({
	read_only: { type: Boolean, default: false }
});

let _convocations = Convocation.all(); // reactive

const drop_and_reject = (ev) => {
	return dropped(ev,null,Convocation.status.rejected);
};

let rejected = Stats.rejected;
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