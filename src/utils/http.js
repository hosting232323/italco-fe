import { storeToRefs } from 'pinia';
import { createHttpClient } from 'generic-module';
import router from '@/plugins/router';
import logoutModule from '@/utils/logout';
import session from '@/utils/session';
import { useUserStore } from '@/stores/user';


const hostname = import.meta.env.VITE_HOSTNAME;


const getTokenRef = () => {
  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);
  return token;
};

const client = createHttpClient({
  hostname,
  authHeader: 'Authorization',
  router,
  refreshEndpoint: 'user/refresh',
  getToken: () => getTokenRef().value,
  setToken: (newToken) => {
    // Il cookie di refresh e' del browser, non della scheda: dopo un login con
    // un altro utente altrove, il rinnovo restituisce il token di quell'utente
    // e il client ripeterebbe la richiesta a suo nome con i dati di questa pagina.
    if (session.belongsToAnotherUser(newToken)) {
      session.handleSessionSwitch();
      return;
    }
    getTokenRef().value = newToken;
  },
  onSessionExpired: (data) => {
    // La richiesta ripetuta senza token fallisce: il logout qui revocherebbe
    // la sessione, che e' quella valida dell'altra scheda.
    if (session.isSwitching())
      return;
    alert(data.message);
    logoutModule.logout(router);
  }
});

const withSessionToken = (url) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(getTokenRef().value)}`;
};


export default {
  ...client,
  hostname,
  withSessionToken
};
