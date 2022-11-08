<template>
	<TopBar @openSettings="openMenu" 
		:title="title"
		:subtitle="subtitle"
	>
		<slot name="topbar"></slot>
	</TopBar>
	<slot>
	</slot>
	<!-- <div  v-if="error" class="errorbox">
		<span class="badge bg-danger">{{ error }}</span>
	</div> -->

</template>

<script>

import TopBar from '../components/TopBar.vue'

export default {
	components: { TopBar },
	props: {
		title: { type: String, default: null },
		subtitle: { type: String, default: null }
	},
	inheritAttrs: false,
	inject: [ 'openMenu' ],
	// async setup() {
	// }
}
</script>

<style >
/* .errorbox {
	z-index: 10;
	background-color: var(--fifth-col);
	width: 80vw;
	height: 80hv;
	text-align: center;
} */
</style>
