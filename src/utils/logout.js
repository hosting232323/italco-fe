import { useUserStore } from '@/stores/user';
import session from '@/utils/session';


// Revoca il refresh token lato server (il cookie viaggia con credentials).
// Fetch diretta, senza passare da http.js, per non creare un import circolare.
// keepalive tiene in vita la richiesta se l'utente chiude subito la scheda:
// senza, il browser la aborta e la sessione resterebbe aperta lato server.
const revokeSession = () => {
  if (typeof fetch !== 'function')
    return Promise.resolve();

  const hostname = import.meta.env.VITE_HOSTNAME;
  try {
    return fetch(`${hostname}user/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive: true
    }).catch(() => {});
  } catch {
    // La disconnessione lato client non deve dipendere dalla rete.
    return Promise.resolve();
  }
};

// Asincrona di proposito: la navigazione aspetta la revoca, cosi' non si finisce
// sulla pagina di login con la sessione ancora valida sul server. La pulizia e
// il redirect stanno in finally perche' devono avvenire comunque, anche se la
// revoca fallisce: un client che si considera disconnesso non deve restare
// nella dashboard perche' il backend non ha risposto.
const logout = async (router) => {
  try {
    await revokeSession();
  } finally {
    resetStores();
    router.push('/');
  }
};

const resetStores = () => {
  useUserStore().$reset();
  // Dati dell'attivita' e lista company del super admin, la stessa pulizia del login.
  session.clearTenantData();
};


export default {
  logout
};
