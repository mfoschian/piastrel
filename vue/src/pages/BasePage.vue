<template>
	<TopBar @openSettings="openMenu" 
		:title="title"
		:subtitle="subtitle"
	>
		<slot name="topbar"></slot>
		<template #subtitle>
			<slot name="subtitle">{{ subtitle }}</slot>
		</template>
	</TopBar>
	<div v-if="network.error" class="errorbox bg-danger">
		<div >Errore di rete (server non raggiungibile)</div>
		<div class="text-warning">{{ network.message }}</div>
	</div>
	<slot>
	</slot>
	<!-- <div  v-if="error" class="errorbox">
		<span class="badge bg-danger">{{ error }}</span>
	</div> -->

</template>

<script>

import TopBar from '../components/TopBar.vue'
import { NetworkStatus } from '../libs/json-fetch';

export default {
	components: { TopBar },
	props: {
		title: { type: String, default: null },
		subtitle: { type: String, default: null }
	},
	inheritAttrs: false,
	inject: [ 'openMenu' ],
	async setup() {
		return {
			network: NetworkStatus
		};
	}
}
</script>

<style lang="scss">
.errorbox {
	z-index: 10;
	// background-color: var(--fifth-col);
	border-radius: 0.5rem;
	// border: 1px dashed yellow;
	width: 80vw;
	margin: auto;
	padding: 0.5rem;
	text-align: center;
	margin-top: 2rem;
	margin-bottom: 2rem;
}
</style>
