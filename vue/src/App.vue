<template>
	<Suspense>
		<router-view
			@openSettings="openSettings" 
		/>
		<template #fallback>
			Loading ...
		</template>
	</Suspense>
	<MenuBar
		:opened="opened"
		:items="menus"
		@close="opened=false"
		@selection="changePage"
	/>
</template>

<script>
import MenuBar from './components/MenuBar.vue'
// import Application from './models/Application'

import { ref } from 'vue'
import { useRouter } from 'vue-router'


export default {
	components: { MenuBar },
	setup(props, context) {

		let opened = ref(false);
		const openSettings = () => { opened.value = true;	}

		let menus = ref([
				{ icon: 'bi-house', label: 'Home', path: '/', active: false, tip: 'Home' },
				{ icon: 'bi-calendar', label: 'Eventi', path: '/events', active: false, tip: 'Gestione Eventi' },
				{ icon: 'bi-geo-alt', label: 'Sezioni', path: '/buckets', tip: 'Gestione Sezioni'}, 
				{ icon: 'bi-upload', label: 'Upload Persons', path: '/backoffice/upload/persons', tip: 'Carica csv persone'}
		]);

		const router = useRouter();

		const changePage = (x) => {
			menus.value.forEach( m => m.active = (m.path == x) )
			router.push( x );
			opened.value = false;
		};

		return {
			opened, menus, openSettings, changePage
		};
	},
	provide() { 
		return {
			openMenu: () => this.openSettings()
		};
	}
}
</script>


<style scoped>
/*
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
*/
</style>
