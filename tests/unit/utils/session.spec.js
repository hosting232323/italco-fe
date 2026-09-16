import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));


// Payload in base64url come lo emette il backend: {"sub":"70",...}.
const jwt = (payload) => {
  const encode = (value) => btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(payload)}.firma`;
};

const storageEvent = (newValue, key = 'user') => ({ key, newValue });

// Quando l'evento storage arriva, in localStorage c'e' gia' il valore nuovo:
// i test lo riproducono, perche' il modulo legge di li' chi e' l'utente attivo.
const inAltraScheda = (value) => {
  if (value === null) localStorage.removeItem('user');
  else localStorage.setItem('user', JSON.stringify(value));
  return JSON.stringify(value);
};


describe('session', () => {
  let session;
  let useUserStore;
  let useOrderStore;
  let useCompanyStore;

  // Il modulo ricorda se il cambio sessione e' gia' partito: ogni test ne
  // importa una copia nuova, insieme agli store, sullo stesso pinia.
  beforeEach(async () => {
    localStorage.clear();
    vi.resetModules();
    setActivePinia(createPinia());
    session = (await import('@/utils/session')).default;
    ({ useUserStore } = await import('@/stores/user'));
    ({ useOrderStore } = await import('@/stores/order'));
    ({ useCompanyStore } = await import('@/stores/company'));
    vi.spyOn(session, 'reload').mockImplementation(() => {});
    vi.spyOn(session, 'goToLogin').mockImplementation(() => {});
  });

  const loggedAs = (userId, role = 'Admin') => {
    const userStore = useUserStore();
    userStore.$patch({ role, userId, token: jwt({ sub: String(userId) }) });
    useOrderStore().setList({ orders: [{ id: 1 }] });
    useCompanyStore().setList({ companies: [{ id: 1 }] });
    return userStore;
  };

  describe('tokenUserId', () => {
    it('legge il sub del token', () => {
      expect(session.tokenUserId(jwt({ sub: '70', role: 'Admin', company_id: 2 }))).toBe('70');
    });

    it('decodifica il base64url anche con caratteri - e _', () => {
      expect(session.tokenUserId(jwt({ sub: '1', note: '??>>' }))).toBe('1');
    });

    it('restituisce null per token vuoti, malformati o senza sub', () => {
      expect(session.tokenUserId('')).toBeNull();
      expect(session.tokenUserId(undefined)).toBeNull();
      expect(session.tokenUserId('non-un-jwt')).toBeNull();
      expect(session.tokenUserId(jwt({ role: 'Admin' }))).toBeNull();
    });
  });

  describe('clearTenantData', () => {
    it('svuota attivita- e company ma lascia l-utente a chi chiama', () => {
      const userStore = loggedAs(1);

      session.clearTenantData();

      expect(useOrderStore().list).toEqual([]);
      expect(useCompanyStore().list).toEqual([]);
      expect(userStore.userId).toBe(1);
    });
  });

  describe('belongsToAnotherUser', () => {
    it('e- vero se il token rinnovato e- di un altro utente', () => {
      loggedAs(1);
      expect(session.belongsToAnotherUser(jwt({ sub: '70' }))).toBe(true);
    });

    it('e- falso per lo stesso utente, anche con company diversa', () => {
      // company/select del super admin riemette il token con lo stesso sub.
      loggedAs(69, 'Super Admin');
      expect(session.belongsToAnotherUser(jwt({ sub: '69', company_id: 4 }))).toBe(false);
    });

    it('e- falso se la scheda non ha ancora un utente o il token e- illeggibile', () => {
      expect(session.belongsToAnotherUser(jwt({ sub: '70' }))).toBe(false);
      loggedAs(1);
      expect(session.belongsToAnotherUser('')).toBe(false);
    });
  });

  describe('handleSessionSwitch', () => {
    it('con un altro utente attivo ricarica per allinearsi a lui', () => {
      const userStore = loggedAs(1);
      inAltraScheda({ role: 'Admin', userId: 70 });

      session.handleSessionSwitch();

      expect(userStore.token).toBe('');
      expect(useOrderStore().list).toEqual([]);
      expect(useCompanyStore().list).toEqual([]);
      expect(alert).toHaveBeenCalledTimes(1);
      expect(session.reload).toHaveBeenCalledTimes(1);
      expect(session.goToLogin).not.toHaveBeenCalled();
      expect(session.isSwitching()).toBe(true);
    });

    it('non azzera lo store utente di un-altra scheda, che lo leggerebbe come logout', () => {
      const userStore = loggedAs(1);
      inAltraScheda({ role: 'Admin', userId: 70 });

      session.handleSessionSwitch();

      expect(userStore.userId).toBe(1);
      expect(userStore.role).toBe('Admin');
    });

    it('dopo un logout altrove va al login senza ricaricare', () => {
      // Ricaricare lascerebbe la scheda su una pagina protetta senza sessione:
      // le richieste fallirebbero e chiuderebbero la sessione aperta altrove.
      const userStore = loggedAs(1);
      inAltraScheda({ role: '', userId: 0 });

      session.handleSessionSwitch();

      expect(session.goToLogin).toHaveBeenCalledTimes(1);
      expect(session.reload).not.toHaveBeenCalled();
      expect(userStore.userId).toBe(0);
    });

    it('parte una volta sola anche con piu- richieste in volo', () => {
      loggedAs(1);
      inAltraScheda({ role: 'Admin', userId: 70 });

      session.handleSessionSwitch();
      session.handleSessionSwitch();

      expect(alert).toHaveBeenCalledTimes(1);
      expect(session.reload).toHaveBeenCalledTimes(1);
    });
  });

  describe('expireLocally', () => {
    it('avvisa una volta sola, svuota e va al login', () => {
      const userStore = loggedAs(1);
      inAltraScheda({ role: 'Admin', userId: 1 });

      session.expireLocally('Sessione scaduta');
      session.expireLocally('Sessione scaduta');
      session.expireLocally('Token assente');

      expect(alert).toHaveBeenCalledTimes(1);
      expect(alert).toHaveBeenCalledWith('Sessione scaduta');
      expect(session.goToLogin).toHaveBeenCalledTimes(1);
      expect(session.reload).not.toHaveBeenCalled();
      expect(useOrderStore().list).toEqual([]);
      expect(userStore.userId).toBe(0);
    });

    it('senza messaggio usa un testo di scorta', () => {
      loggedAs(1);

      session.expireLocally(undefined);

      expect(alert).toHaveBeenCalledWith('Sessione scaduta');
    });

    it('non tocca lo store utente se in localStorage c-e- gia- un-altra scheda', () => {
      const userStore = loggedAs(1);
      inAltraScheda({ role: 'Admin', userId: 70 });

      session.expireLocally('Sessione scaduta');

      expect(userStore.userId).toBe(1);
      expect(userStore.token).toBe('');
      expect(useOrderStore().list).toEqual([]);
    });

    it('non parte se e- gia- in corso un cambio sessione', () => {
      loggedAs(1);
      inAltraScheda({ role: 'Admin', userId: 70 });
      session.handleSessionSwitch();
      alert.mockClear();

      session.expireLocally('Sessione scaduta');

      expect(alert).not.toHaveBeenCalled();
    });
  });

  describe('onStorage', () => {
    it('login di un altro utente in un-altra scheda', () => {
      loggedAs(1);

      session.onStorage(storageEvent(inAltraScheda({ role: 'Admin', userId: '70' })));

      expect(session.reload).toHaveBeenCalledTimes(1);
    });

    it('logout in un-altra scheda: al login, senza ricaricare', () => {
      loggedAs(1);

      session.onStorage(storageEvent(inAltraScheda({ role: '', userId: 0, company: null })));

      expect(session.goToLogin).toHaveBeenCalledTimes(1);
      expect(session.reload).not.toHaveBeenCalled();
    });

    it('localStorage svuotato (key null) o valore illeggibile', () => {
      loggedAs(1);
      inAltraScheda(null);

      session.onStorage(storageEvent(null, null));

      expect(session.goToLogin).toHaveBeenCalledTimes(1);
    });

    it('valore non JSON vale come nessun utente', () => {
      loggedAs(1);
      localStorage.setItem('user', '{rotto');

      session.onStorage(storageEvent('{rotto'));

      expect(session.goToLogin).toHaveBeenCalledTimes(1);
    });

    it('ignora lo stesso utente, per esempio il cambio company del super admin', () => {
      loggedAs(69, 'Super Admin');

      session.onStorage(storageEvent(inAltraScheda({ role: 'Super Admin', userId: 69, company: { id: 4 } })));

      expect(session.reload).not.toHaveBeenCalled();
      expect(session.goToLogin).not.toHaveBeenCalled();
    });

    it('stesso utente ma ruolo cambiato in un-altra scheda (utente promosso o ri-creato)', () => {
      loggedAs(70);

      session.onStorage(storageEvent(inAltraScheda({ role: 'Super Admin', userId: 70 })));

      expect(session.reload).toHaveBeenCalledTimes(1);
    });

    it('stesso utente e stesso ruolo ma company diversa resta ignorato', () => {
      loggedAs(70);

      session.onStorage(storageEvent(inAltraScheda({ role: 'Admin', userId: 70, company: { id: 9 } })));

      expect(session.reload).not.toHaveBeenCalled();
      expect(session.goToLogin).not.toHaveBeenCalled();
    });

    it('ignora altre chiavi e schede senza utente', () => {
      session.onStorage(storageEvent(JSON.stringify({ userId: 70 })));
      loggedAs(1);
      session.onStorage(storageEvent('qualcosa', 'altro'));

      expect(session.reload).not.toHaveBeenCalled();
      expect(session.goToLogin).not.toHaveBeenCalled();
    });
  });

  describe('watchOtherTabs', () => {
    it('ascolta gli eventi storage e si puo- staccare', () => {
      const target = new EventTarget();
      loggedAs(1);
      const valore = inAltraScheda({ role: 'Admin', userId: 70 });

      const stop = session.watchOtherTabs(target);
      stop();
      target.dispatchEvent(Object.assign(new Event('storage'), { key: 'user', newValue: valore }));
      expect(session.reload).not.toHaveBeenCalled();

      session.watchOtherTabs(target);
      target.dispatchEvent(Object.assign(new Event('storage'), { key: 'user', newValue: valore }));
      expect(session.reload).toHaveBeenCalledTimes(1);
    });
  });
});
