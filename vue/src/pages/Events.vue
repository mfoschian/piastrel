<template>
	<BasePage >
		<template #topbar>
			<h3>Eventi</h3>
		</template>
		<div class="container">
			<div v-if="items.length > 0" class="row">
				<div class="col align-self-center">Nome</div>
				<div class="col align-self-center">Data</div>
				<div class="col align-self-center">Attivo?</div>
				<div class="col actions align-self-center">
					<span class="btn bi-plus-square-fill text-danger" @click="newEvent"></span>
				</div>
			</div>
			<div v-if="page_error" class="row">
				<div class="col text-center error_msg bg-danger">{{ page_error }}</div>
			</div>
			<div v-for="e in items" :key="e.id" class="row">
				<div class="col">{{e.title}}</div>
				<div class="col">{{e.date}}</div>
				<div class="col">{{e.active ? 'Attivo' : 'Chiuso'}}</div>
				<div class="col actions">
					<span class="btn bi-pencil" @click="edit(e)"></span>
					<span class="btn bi-trash" @click="remove(e)"></span>
				</div>
			</div>
		</div>

		<div class="modal fade" :class="{ show: dlgVisible, 'd-block': dlgVisible }">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">Nuovo Evento</div>
						<button type="button" class="btn-close" @click="hideDialog"></button>
					</div>
					<div class="modal-body">
						XXX
						<!-- <RoomEditor :room="selected_room" @save="save" @dismiss="hideDialog" :error="dialog_error" /> -->
					</div>
				</div>
			</div>
		</div>		
	</BasePage>
</template>

<script>
import { ref } from 'vue'

import BasePage from './BasePage.vue'
import { Event } from '../models/Event'

export default {
	components: { BasePage },
	async setup(props,context) {

		const max_items = 20;
		let _items = await Event.load( max_items ); // reactive !


		return {
			items: _items
		}
	}
}

</script>

<style lang="scss">

.container {
	
	font-size: 1.2rem;

	.row {
		
		&:first-child {
			background-color: var(--fifth-col);
			font-weight: bold;
		}

		&:last-child {
			border-bottom: 1px solid var(--fifth-col);
		}

		&:nth-child(even) {
			background-color: var(--second-col);
		}

		.col {

			padding: 0.5rem;
			border-right: 1px solid var(--fifth-col);

			&:first-child {
				border-left: 1px solid var(--fifth-col);
			}

			&.actions {
				text-align: right;
				flex-grow: 0.2;
				
				span {
					padding: 0.3rem;
				}
			}
		}


	}
}

</style>