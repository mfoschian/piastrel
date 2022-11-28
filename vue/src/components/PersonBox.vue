<template>
	<div class="person" 
		:class="{draggable: draggable, dragging: dragging, status: item.status }"
		:draggable="draggable"
		@dragstart="dragme($event)"
		@dragend="dragstop"
	>
		<span class="name">{{ item.last_name }} {{ item.first_name }}</span>
		<span class="buttons">
			<button class="btn btn-sm" @click="changeStatus">X</button>
		</span>
	</div>	
</template>

<script>
import { ref } from 'vue'
import { Convocation } from '../models/Convocation';

export default {
	props: {
		item: { type: Object, required: true },
		draggable: { type: Boolean, default: true }
	},
	setup(props, context) {
		let dragging = ref(false);

		const dragme = (ev) => {
			let dt = ev.dataTransfer;
			dt.dropEffect = 'move';
			dt.setData("person_id", props.item.person_id );
			dt.setData("type", "person");
			dragging.value = true;
			// setTimeout( () => { dragging.value = false }, 100 );
		};

		const dragstop = () => {
			dragging.value = false;
		};

		const changeStatus = () => {
			let c = Convocation.ofPerson(props.item.person_id);
			if( c ) {
				c.status = 'pippo'
			}
		};

		return {
			dragme, dragstop,
			dragging,
			changeStatus
		}
	}
}
</script>

<style lang="scss">
.person {
	padding: 0.35rem;

	&.draggable {
		cursor: grab;
	}

	&.dragging {
		background-color: var(--fifth-col);
		border-radius: var(--bs-border-radius);
		max-width: 15rem;
	}
}
</style>