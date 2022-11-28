<template>
	<div class="person" :draggable="draggable" @dragstart="dragme($event)">
		<span class="name">{{ item.last_name }} {{ item.first_name }} - {{ item.person_id }}</span>
	</div>	
</template>

<script>
export default {
	props: {
		item: { type: Object, required: true },
		draggable: { type: Boolean, default: true }
	},
	setup(props, context) {
		const dragme = (ev) => {
			let dt = ev.dataTransfer;
			dt.setData("person_id", props.item.person_id );
			dt.setData("type", "person");
		};

		return {
			dragme
		}
	}
}
</script>