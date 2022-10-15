<template>
	<div class="welcome_msg">
		<h3>Di seguito i link alle videoconferenze in <span class="room_label">{{ roomLabel }}</span> il <input type="date" class="the_date" @change="dateChanged" :value="date" ></h3>
		<h4><span class="badge badge-warning">Si consiglia di utilizzare Chrome</span></h4>
	</div>
</template>

<script>

const DEFAULT_ROOM_NAME = "programma";

export default {
	props: {
		room_label : { type: String, default: DEFAULT_ROOM_NAME },
		date: { type: String, required: true }
	},
	computed: {
		roomLabel() {
			return this.room_label || DEFAULT_ROOM_NAME;
		}
	},
	methods: {
		dateChanged(ev) {
			let value = ev.target.value;
			// console.log( "Changed date to %s", value );
			this.$emit('dateChanged', value );
		}
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