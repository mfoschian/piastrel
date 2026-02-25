<template>
	<TopBar @openSettings="openMenu" 
		:title="title"
		:subtitle="subtitle"
	>
		<slot name="topbar"></slot>
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

<script setup>
import { inject } from 'vue';
import TopBar from '../components/TopBar.vue'
import { NetworkStatus as network} from '../libs/json-fetch';

// defineOptions({
// 	inheritAttrs: false
// });

const props = defineProps({
	title: { type: String, default: null },
	subtitle: { type: String, default: null }
});


const openMenu = inject('openMenu');


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
