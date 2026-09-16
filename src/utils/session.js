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

// Utente che il browser considera attivo adesso: lo scrive l'ultima scheda che
// ha fatto login o logout, e non e' detto che sia quello di questa scheda.
const storedUser = (raw) => {
  try {
    return JSON.parse(raw ?? localStorage.getItem(USER_STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
};

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

// Lo store utente e' persistito: ogni sua modifica, anche solo del token,
// riscrive in localStorage ruolo e id di questa scheda. Se li' c'e' gia'
// l'utente di un'altra scheda non va toccato, altrimenti quella riceverebbe
// un utente vecchio (o un logout) e si allineerebbe a lui. Si azzera solo
// quando in localStorage c'e' lo stesso utente o nessuno.
const clearUserKeepingOtherTabs = () => {
  const userStore = useUserStore();
  const stored = storedUser();
  if (!hasUser(stored.userId) || String(stored.userId) === String(userStore.userId))
    userStore.$reset();
  clearTenantData();
};

// La sessione del browser e' ormai di un altro utente (o non c'e' piu').
// Con un utente attivo si ricarica, cosi' la scheda riparte allineata a lui;
// dopo un logout si va al login senza ricaricare, perche' una pagina protetta
// senza sessione manderebbe richieste destinate a fallire, e ogni fallimento
// chiuderebbe la sessione che intanto un'altra scheda puo' aver aperto.
const handleSessionSwitch = () => {
  if (switching)
    return;
  switching = true;
  const stillLoggedIn = hasUser(storedUser().userId);
  clearUserKeepingOtherTabs();
  alert('In un\'altra scheda la sessione è cambiata (nuovo accesso o logout): la pagina verrà ricaricata.');
  if (stillLoggedIn)
    session.reload();
  else
    session.goToLogin();
};

// Sessione non piu' valida per questa scheda. Niente revoca sul server: se il
// refresh e' fallito il cookie e' gia' inservibile, e se nel frattempo e' di
// un'altra scheda la revoca chiuderebbe la sessione sbagliata. Le richieste in
// volo falliscono tutte insieme, ma l'utente vede un avviso solo.
const expireLocally = (message) => {
  if (switching)
    return;
  switching = true;
  clearUserKeepingOtherTabs();
  alert(message || 'Sessione scaduta');
  session.goToLogin();
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

  const stored = storedUser(event.newValue);
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
  expireLocally,
  isSwitching: () => switching,
  onStorage,
  watchOtherTabs,
  reload: () => window.location.reload(),
  goToLogin: () => window.location.assign('/')
};


export default session;
