import { storeToRefs } from 'pinia';
import { createHttpClient } from 'generic-module';
import router from '@/plugins/router';
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
    // Durante un cambio sessione lo store utente non si tocca (vedi session.js):
    // la richiesta ripetuta parte col token scaduto e il backend la rifiuta.
    if (session.isSwitching())
      return;
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
    // Chiusura locale: niente revoca sul server. Il cookie e' condiviso da tutte
    // le schede e potrebbe gia' essere di una sessione aperta altrove.
    session.expireLocally(data.message);
  }
});

// Il backend risponde 'company_blocked' a ogni richiesta di un'attivita' bloccata
// dal super admin: se il blocco arriva a sessione aperta, il layout lo mostra
// subito invece di lasciare le pagine vuote.
const markBlocked = (data) => {
  if (data?.status != 'company_blocked') return;
  const userStore = useUserStore();
  if (userStore.company) userStore.company = { ...userStore.company, blocked: true };
};

const detectingBlock = (request) => (endpoint, method, options, func) =>
  request(endpoint, method, options, (data) => {
    markBlocked(data);
    if (func) func(data);
  });

const withSessionToken = (url) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}token=${encodeURIComponent(getTokenRef().value)}`;
};


export default {
  ...client,
  makeRequest: detectingBlock(client.makeRequest),
  uploadRequest: detectingBlock(client.uploadRequest),
  hostname,
  withSessionToken
};
