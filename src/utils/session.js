import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import tenantStores from '@/utils/tenantStores';


// Il refresh token e' un cookie HttpOnly: il browser ne ha uno solo, condiviso
// da tutte le schede. Lo stato pinia invece vive in ogni scheda per conto suo.
// Se in una scheda si fa logout/login con un altro utente, le altre continuano
// a mostrare i dati del precedente e, al primo token scaduto, il refresh le fa
// proseguire come il nuovo utente: e' cosi' che il 14/09 un ordine compilato
// con clienti e servizi dell'attivita' 1 e' partito come utente dell'attivita' 2.

// Chiave con cui pinia-plugin-persistedstate salva lo store utente.
const USER_STORAGE_KEY = 'user';

let switching = false;

// Id utente (claim `sub`) di un JWT. Nessuna verifica di firma: serve solo a
// capire di chi e' il token appena ricevuto dal nostro backend.
const tokenUserId = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
    const { sub } = JSON.parse(atob(padded));
    return sub == null ? null : String(sub);
  } catch {
    return null;
  }
};

const hasUser = (userId) => Boolean(userId) && String(userId) !== '0';

// Dati dell'attivita' e lista company del super admin. Lo store utente resta
// fuori: chi chiama decide se azzerarlo (logout) o sovrascriverlo (login).
const clearTenantData = () => {
  useCompanyStore().$reset();
  tenantStores.reset();
};

const belongsToAnotherUser = (token) => {
  const { userId } = useUserStore();
  const owner = tokenUserId(token);
  return hasUser(userId) && owner !== null && owner !== String(userId);
};

// La sessione del browser e' ormai quella di un altro utente: questa scheda non
// deve piu' mandare niente. Lo store utente non si azzera con $reset perche' e'
// persistito, e la scrittura in localStorage arriverebbe alle altre schede come
// un logout, chiudendo anche la sessione valida. Si toglie il solo token (non
// persistito), si svuotano i dati e si ricarica: al reload la scheda si allinea
// all'utente attivo nel browser, o torna al login.
const handleSessionSwitch = () => {
  if (switching)
    return;
  switching = true;
  useUserStore().token = '';
  clearTenantData();
  alert('In un\'altra scheda la sessione è cambiata (nuovo accesso o logout): la pagina verrà ricaricata.');
  session.reload();
};

// Evento `storage`: arriva alle altre schede quando una scrive in localStorage,
// cioe' subito dopo un login o un logout, senza aspettare il refresh. Si
// confrontano identita' e ruolo: a parita' di userId un ruolo diverso (utente
// ri-creato o promosso, re-login con permessi cambiati) va allineato lo stesso,
// perche' il refresh riconoscerebbe lo stesso `sub` e terrebbe il ruolo vecchio.
const onStorage = (event) => {
  if (event.key !== USER_STORAGE_KEY && event.key !== null)
    return;

  const { userId, role } = useUserStore();
  if (!hasUser(userId))
    return;

  let stored;
  try {
    stored = JSON.parse(event.newValue) ?? {};
  } catch {
    stored = {};
  }
  const sameUser = String(stored.userId ?? 0) === String(userId);
  const sameRole = String(stored.role ?? '') === String(role);
  if (!sameUser || !sameRole)
    handleSessionSwitch();
};

const watchOtherTabs = (target = window) => {
  target.addEventListener('storage', onStorage);
  return () => target.removeEventListener('storage', onStorage);
};

const session = {
  tokenUserId,
  clearTenantData,
  belongsToAnotherUser,
  handleSessionSwitch,
  isSwitching: () => switching,
  onStorage,
  watchOtherTabs,
  reload: () => window.location.reload()
};


export default session;
