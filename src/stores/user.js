import { defineStore } from 'pinia';

// Chi ha usato l'app prima di questo cambio si ritrova in localStorage lo stato
// completo, token incluso. Va ripulito *prima* della reidratazione: `pick` da
// solo impedisce le scritture future ma non cancella il valore gia' salvato,
// che resterebbe leggibile da qualunque XSS finche' lo stato non cambia.
const purgeLegacyToken = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const stored = JSON.parse(raw);
    if (stored && 'token' in stored) {
      delete stored.token;
      localStorage.setItem(key, JSON.stringify(stored));
    }
  } catch {
    localStorage.removeItem(key);
  }
};

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    userId: 0,
    token: ''
  }),
  // L'access token vive solo in memoria: al reload viene riottenuto dal
  // refresh token (cookie HttpOnly). Persistiamo solo role/userId per la UI.
  //
  // L'opzione si chiama `pick`: in pinia-plugin-persistedstate v4 `paths` non
  // esiste piu' e viene ignorata in silenzio, con l'effetto di persistere lo
  // stato intero — token compreso, cioe' esattamente cio' che si vuole evitare.
  persist: {
    pick: ['role', 'userId'],
    beforeHydrate: (context) => purgeLegacyToken(context.store.$id)
  }
});
