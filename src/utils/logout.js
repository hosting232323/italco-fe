import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useCompanyStore } from '@/stores/company';
import { useServiceStore } from '@/stores/service';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';

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
  useOrderStore().$reset();
  useCompanyStore().$reset();
  useServiceStore().$reset();
  useScheduleStore().$reset();
  useTransportStore().$reset();
  useCustomerRuleStore().$reset();
  useCustomerGroupStore().$reset();
  useGeographicZoneStore().$reset();
  useCollectionPointStore().$reset();
  useAdministrationUserStore().$reset();
};

export default {
  logout
};
