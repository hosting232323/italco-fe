import App from './App.vue';
import { createApp } from 'vue';
import { registerPlugins } from '@/plugins';
import session from '@/utils/session';
import apiSite from '@/utils/apiSite';

// Pagina aperta su un sito diverso da quello dell'API (es. il dominio vecchio):
// il cookie di refresh non partirebbe e ogni ricarica chiuderebbe la sessione.
const apiSiteUrl = apiSite.sameSiteUrl(window.location, import.meta.env.VITE_HOSTNAME);

if (apiSiteUrl)
  window.location.replace(apiSiteUrl);
else {
  const app = createApp(App);

  registerPlugins(app);
  // Login o logout in un'altra scheda: questa non deve restare sui dati di prima.
  session.watchOtherTabs();

  // Prima il token, poi le pagine: vedi restoreAccessToken.
  session.restoreAccessToken().finally(() => app.mount('#app'));
}
