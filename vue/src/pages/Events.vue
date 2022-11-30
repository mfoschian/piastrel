<template>
	<BasePage >
		<template #topbar>
			<h3>Eventi</h3>
		</template>
		<div class="container mytable">
			<div v-if="items.length > 0" class="row">
				<div class="col align-self-center">Nome</div>
				<div class="col align-self-center">Data</div>
				<div class="col align-self-center">Attivo?</div>
				<div class="col actions align-self-center">
					<span class="btn bi-plus-square-fill text-danger" @click="newEvent"></span>
				</div>
			</div>
			<div v-else class="row">
				<div class="col-12 actions align-self-center">
					Nessun evento definito: aggiungine uno
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
						<div class="modal-title">{{ editor_title }}</div>
						<button type="button" class="btn-close" @click="cancel"></button>
					</div>
					<div class="modal-body">
						<EventEditor 
							:event="edited_item"
							@cancel="cancel"
							@save="save"
						/>
					</div>
				</div>
			</div>
		</div>
	</BasePage>
</template>

<script>
import { ref, computed } from 'vue'

import BasePage from './BasePage.vue'
import EventEditor from '../components/events/EventEditor.vue'
import { Event } from '../models/Event'


export default {
	components: { BasePage, EventEditor },
	async setup(props,context) {

		const max_items = 20;
		let _items = await Event.load( max_items ); // reactive !

		let _edited_item = ref(Event.new());
		let editor_title = computed( () => _edited_item.value.id == null ? "Nuovo Evento" : "Modifica Evento" );

		let dlgVisible = ref(false);
		let page_error = ref(null);

		const newEvent = () => {
			_edited_item.value = Event.new();
			dlgVisible.value = true;
		};

		const cancel = () => {
			dlgVisible.value = false;
		};

		const edit = (e) => {
			let ev = {
				id: e.id,
				title: e.title,
				date: e.date,
				active: e.active
			};
			// debugger
			_edited_item.value = ev;
			dlgVisible.value = true;
		};

		const save = async (e) => {
			try {
				await Event.save(e);
				dlgVisible.value = false;
			}
			catch( err ) {
				console.error( err );
				page_error.value = err.toString();
				dlgVisible.value = false;
			}
		};

		const remove = async (e) => {
			let confirmed = confirm( `Stai per cancellare l'evento "${e.title}".\nConfermi ?` );
			if( confirmed != true )
				return;

			try {
				await Event.remove(e.id);
				dlgVisible.value = false;
			}
			catch( err ) {
				console.error( err );
				page_error.value = err.toString();
				dlgVisible.value = false;
			}
		};


		return {
			items: _items,
			newEvent,
			cancel,
			edit, save, remove,
			page_error,
			dlgVisible,
			edited_item: _edited_item,
			editor_title
		}
	}
}

</script>

<style lang="scss" >
@import "../scss/table.scss"
</style>