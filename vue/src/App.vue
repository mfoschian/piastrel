<template>
	<TopBar :title="title" :subtitle="subtitle" @openSettings="openSettings" />
	<MenuBar
		:opened="opened"
		:items="menus"
		@close="opened=false"
		@selection="changePage"

	/>
	<Suspense>
		<router-view />
		<template #fallback>
			<h2>Loading ...</h2>
		</template>
	</Suspense>
</template>

<script>
// import Settings from './settings'
import TopBar from './components/TopBar.vue'
import MenuBar from './components/MenuBar.vue'
import Application from './models/Application'

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'


export default {
	components: { TopBar, MenuBar },
	setup(props, context) {

		let opened = ref(false);
		const openSettings = () => { opened.value = true;	}

		let menus = ref([
				{ icon: 'bi-house', label: 'Home', path: '/', active: false, tip: 'Home' },
				{ icon: 'bi-gear', label: 'Eventi', path: '/events', active: false, tip: 'Gestione Eventi' },
		]);

		const router = useRouter();

		const changePage = (x) => {
			menus.value.forEach( m => m.active = (m.path == x) )
			router.push( x );
			opened.value = false;
		};

		return {
			opened, menus, openSettings, changePage,
			title: Application.title, subtitle: Application.subtitle
		};
	},
	methods: {
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
