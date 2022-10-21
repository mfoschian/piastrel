import { createRouter, createWebHashHistory } from 'vue-router'

import Viewer from './pages/Dashboard.vue'


const routes = [
	{
		path: '/',
		component: Viewer,
		// props: route => ({
		// 	at: route.query.at,
		// 	room: route.query.room
		// })
	}
];

let router = null;

export const Router = {
	create() {
		if( router != null )
			return router;

		router = createRouter({
			history: createWebHashHistory(),
			routes
		});
		return router;
	}
};