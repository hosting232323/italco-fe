import App from './App.vue';
import { createApp } from 'vue';
import { registerPlugins } from '@/plugins';
import session from '@/utils/session';

const app = createApp(App);

registerPlugins(app);
// Login o logout in un'altra scheda: questa non deve restare sui dati di prima.
session.watchOtherTabs();

app.mount('#app');
