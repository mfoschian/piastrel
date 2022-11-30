import { createRouter, createWebHashHistory } from 'vue-router'

import DashboardPage from './pages/Dashboard.vue'
import EventPage from './pages/Events.vue'


const routes = [
	{
		name: 'home',
		path: '/',
		component: DashboardPage,
		props: { event_id: null }
	},
	{
		name: 'dashboard',
		path: '/events/:event_id/manage',
		component: DashboardPage,
		props: true
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