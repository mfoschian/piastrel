<template>
	<div class="box">
		<div class="title">
			<slot><h3 v-if="title">{{ title }}</h3></slot>
			<h3><i class="bi-list clickable" @click="$emit('openSettings')"></i></h3>
		</div>

		<!-- <h4><span v-if="event_name == ''" class="badge badge-warning">Scegliere l'evento</span></h4> -->
		<h4 v-if="subtitle"><span class="badge bg-warning">{{ subtitle }}</span></h4>
	</div>
</template>

<script setup>

const props = defineProps({
	title: { type: String, default: 'myApp' },
	subtitle: { type: String, default: null }
});

const emit = defineEmits([ 'openSettings' ]);

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