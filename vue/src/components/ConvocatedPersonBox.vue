<template>
	<div class="person" 
		:class="[{draggable: is_draggable, dragging: dragging  },status_class]"
		:draggable="is_draggable"
		@dragstart="dragme($event)"
		@dragend="dragstop"
	>
		<span class="name"><span class="bi" :class="status_icon"></span>{{ item.last_name }} {{ item.first_name }}</span>
		<span class="buttons">
			<button class="btn btn-sm" @click="openInfoBox">
				<!-- <span class="bi bi-md bi-caret-right-square" ></span> -->
				<span class="bi bi-md bi-box-arrow-up-right" ></span>
			</button>
		</span>
	</div>	
</template>

<script>
import { ref, computed } from 'vue'
import { Convocation } from '../models/Convocation';

export default {
	props: {
		item: { type: Object, required: true },
		draggable: { type: Boolean, default: true },
		read_only: { type: Boolean, default: true }
	},
	emits: [ 'details' ],
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

		let is_draggable = computed( () => {
			return props.draggable && !props.read_only;
		});

		const openInfoBox = () => {
			context.emit('details', props.item.person_id );
		};

		const status_class = computed( () => {
			return "st-" + (props.item.status || Convocation.status.unknown);
		});
		const status_icon = computed( () => {
			switch( props.item.status ) {
				case Convocation.status.accepted: return 'bi-check';
				// case Convocation.status.accepted: return 'bi-person-check-fill';
				case Convocation.status.rejected: return 'bi-dash-circle';
				// bi-check2-all
				// bi-check2
				// bi-check2-square
				// bi-clipboard2-check
				// case Convocation.status.confirmed: return 'bi-person-lock';
				case Convocation.status.confirmed: return 'bi-check-all';
				case Convocation.status.unknown:
				default:
					return 'bi-person';
			}
			return "st-" + (props.item.status || Convocation.status.unknown);
		});

		return {
			dragme, dragstop,
			dragging, is_draggable,
			openInfoBox, status_class, status_icon
		}
	}
}

export const dropcheck = (ev) => {
	ev.preventDefault();
};

export const dropped = async (ev, bid, status) => {
	let dt = ev.dataTransfer;
	let type = dt.getData("type");
	// console.log(type);
	if( type == "person" ) {
		const pid = dt.getData("person_id");
		if( !pid )
			return;

		await Convocation.assign(pid, bid, status);
	}
};

</script>

<style lang="scss">
.person {
	padding: 0.35rem;
	border-radius: var(--bs-border-radius);
	margin-top: 0.2rem;

	.name {
		span {
			margin-right: 0.5rem;
		}
	}

	&.st-accepted {
		background-color: rgb(var(--bs-primary-rgb));
	}
	&.st-contacted {
		border: 1px solid rgb(var(--bs-primary-rgb));
	}
	&.st-confirmed {
		background-color: rgb(var(--bs-success-rgb));
	}
	&.st-rejected {
		background-color: rgb(var(--bs-danger-rgb));
	}

	&.draggable {
		cursor: grab;
	}

	&.dragging {
		background-color: var(--fifth-col);
		color: var(--fifth-text-col);
		max-width: 15rem;
	}
}
</style>