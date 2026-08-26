import { defineStore } from 'pinia';

// Chi ha usato l'app prima di questo cambio si ritrova in localStorage lo stato
// completo, token incluso. Va ripulito *prima* della reidratazione: `pick` da
// solo impedisce le scritture future ma non cancella il valore gia' salvato,
// che resterebbe leggibile da qualunque XSS finche' lo stato non cambia.
const sanitizePersistedUser = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const stored = JSON.parse(raw);
    let changed = false;
    if (stored && 'token' in stored) {
      delete stored.token;
      changed = true;
    }
    // La company selezionata dal Super Admin vive nel solo access token:
    // dopo un reload va scelta di nuovo, non simulata dal localStorage.
    if (stored?.role == 'Super Admin' && stored.company) {
      delete stored.company;
      changed = true;
    }
    if (changed) localStorage.setItem(key, JSON.stringify(stored));
  } catch {
    localStorage.removeItem(key);
  }
};

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    userId: 0,
    token: '',
    // Company su cui si sta operando. Per tutti i ruoli tranne il super admin è
    // la propria e non cambia mai; il super admin parte senza e la sceglie.
    company: null
  }),
  // L'access token vive solo in memoria: al reload viene riottenuto dal
  // refresh token (cookie HttpOnly). Persistiamo ruolo, id e la company fissa dei
  // normali utenti; per il Super Admin la company viene eliminata in hydrate.
  //
  // L'opzione si chiama `pick`: in pinia-plugin-persistedstate v4 `paths` non
  // esiste piu' e viene ignorata in silenzio, con l'effetto di persistere lo
  // stato intero — token compreso, cioe' esattamente cio' che si vuole evitare.
  persist: {
    pick: ['role', 'userId', 'company'],
    beforeHydrate: (context) => sanitizePersistedUser(context.store.$id)
  }
});
