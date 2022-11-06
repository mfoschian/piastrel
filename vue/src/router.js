import { createRouter, createWebHashHistory } from 'vue-router'

import DashboardPage from './pages/Dashboard.vue'
import EventPage from './pages/Events.vue'


const routes = [
	{
		path: '/',
		component: DashboardPage,
		// props: route => ({
		// 	at: route.query.at,
		// 	room: route.query.room
		// })
	},
	{
		path: '/events',
		component: EventPage
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