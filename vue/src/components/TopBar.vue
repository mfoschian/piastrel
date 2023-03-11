<template>
	<div class="box">
		<div class="title">
			<slot><h3 v-if="title">{{ title }}</h3></slot>
			<!-- <h3>Piastrel</h3> -->
			<h3><i class="bi-list clickable" @click="$emit('openSettings')"></i></h3>
		</div>

		<!-- <h4><span v-if="event_name == ''" class="badge badge-warning">Scegliere l'evento</span></h4> -->
		<h4 v-if="subtitle">
			<span class="badge bg-warning">
				<slot name="subtitle">{{ subtitle }}</slot>
			</span>
		</h4>
	</div>
</template>

<script>

export default {
	props: {
		title: { type: String, default: 'myApp' },
		subtitle: { type: String, default: null }
	},
	emits: [ 'openSettings' ],
	computed: {
	},
	methods: {
	}
}

</script>


<style scoped lang="scss">
.box {
	padding: 1.5em;	
	.title {
		display: flex;
		justify-content: space-between;
		.room_label {
			font-weight: bold;
		}
	}
	

}


</style>