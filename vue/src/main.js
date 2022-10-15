import { createApp } from 'vue'
import { Router } from './router'

import './scss/styles.scss'

import * as bootstrap from 'bootstrap'

import App from './App.vue'

const app = createApp(App);

app.use( Router.create() );
app.mount('#app');
