<template>
	<div class="welcome_msg">
		<h3>Piastrel</h3>
		<h4><span v-if="event_name == ''" class="badge badge-warning">Scegliere l'evento</span></h4>
	</div>
</template>

<script>

const DEFAULT_ROOM_NAME = "programma";

export default {
	props: {
		event_name: { type: String, default: null }
	},
	computed: {
	},
	methods: {
	}
}

</script>


<style scoped>
.welcome_msg {
	padding: 1.5em;	
}

.room_label {
	font-weight: bold;
}

.the_date {
	border: none;
	font-weight: bold;
	/*background-color: white;*/
	/*background-color: #68b3a5;*/
	background-color: #3580c2;
}
</style>