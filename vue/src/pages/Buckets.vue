<template>
	<BasePage >
		<template #topbar>
			<h3>Sezioni</h3>
		</template>
		<div class="container mytable">
			<div v-if="items.length > 0" class="row">
				<div class="col align-self-center">Nome</div>
				<div class="col actions align-self-center">
					<span class="btn bi-plus-square-fill text-danger" @click="newBucket"></span>
				</div>
			</div>
			<div v-else class="row">
				<div class="col-12 actions align-self-center">
					Nessun evento definito: aggiungine uno
					<span class="btn bi-plus-square-fill text-danger" @click="newBucket"></span>
				</div>
			</div>
			<div v-if="page_error" class="row">
				<div class="col text-center error_msg bg-danger">{{ page_error }}</div>
			</div>
			<div v-for="e in items" :key="e.id" class="row">
				<div class="col">{{e.name}}</div>
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
						<BucketEditor 
							:bucket="edited_item"
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
import BucketEditor from '../components/buckets/BucketEditor.vue'
import { Bucket } from '../models/Bucket'


export default {
	components: { BasePage, BucketEditor },
	async setup(props,context) {

		let _items = await Bucket.all(); // reactive !

		let _edited_item = ref(Bucket.new());
		let editor_title = computed( () => _edited_item.value.id == null ? "Nuova Sezione" : "Modifica Sezione" );

		let dlgVisible = ref(false);
		let page_error = ref(null);

		const newBucket = () => {
			_edited_item.value = Bucket.new();
			dlgVisible.value = true;
		};

		const cancel = () => {
			dlgVisible.value = false;
		};

		const edit = (e) => {
			let ev = {
				id: e.id,
				name: e.name
			};
			// debugger
			_edited_item.value = ev;
			dlgVisible.value = true;
		};

		const save = async (e) => {
			try {
				await Bucket.save(e);
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
				await Bucket.remove(e.id);
				dlgVisible.value = false;
			}
			catch( err ) {
				console.error( err );
				page_error.value = err.toString();
				dlgVisible.value = false;
			}
		};

		await Bucket.load();

		return {
			items: _items,
			newBucket,
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