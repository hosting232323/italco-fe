import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import piniaPersist from 'pinia-plugin-persistedstate';

import { useUserStore } from '@/stores/user';


const KEY = 'user';

// Lo store va creato con il plugin di persistenza attivo: e' lui a invocare
// beforeHydrate, e senza di lui la pulizia dello stato salvato non parte.
// L'app serve davvero: finche' pinia non e' installata da qualche parte,
// pinia.use() tiene i plugin in coda e non li applica a nessuno store.
const attivaPinia = () => {
  const pinia = createPinia();
  pinia.use(piniaPersist);
  createApp({}).use(pinia);
  setActivePinia(pinia);
};

const salvato = () => JSON.parse(localStorage.getItem(KEY));


describe('user store, stato persistito', () => {
  beforeEach(() => {
    localStorage.clear();
    attivaPinia();
  });

  it('cancella il token rimasto in localStorage prima di reidratare', () => {
    localStorage.setItem(KEY, JSON.stringify({ role: 'Admin', userId: 7, token: 'jwt-vecchio' }));

    const store = useUserStore();

    expect(salvato().token).toBeUndefined();
    expect(store.token).toBe('');
    expect(store.role).toBe('Admin');
    expect(store.userId).toBe(7);
  });

  it('scarta la company del Super Admin, che vive nel solo access token', () => {
    localStorage.setItem(KEY, JSON.stringify({ role: 'Super Admin', company: { id: 4 } }));

    const store = useUserStore();

    expect(salvato().company).toBeUndefined();
    expect(store.company).toBeNull();
  });

  it('conserva la company degli altri ruoli, che non cambia mai', () => {
    localStorage.setItem(KEY, JSON.stringify({ role: 'Admin', company: { id: 4 } }));

    const store = useUserStore();

    expect(salvato().company).toEqual({ id: 4 });
    expect(store.company).toEqual({ id: 4 });
  });

  it('lascia intatto uno stato che non ha niente da ripulire', () => {
    const pulito = { role: 'Admin', userId: 7 };
    localStorage.setItem(KEY, JSON.stringify(pulito));

    useUserStore();

    expect(salvato()).toEqual(pulito);
  });

  it('non tocca localStorage quando non trova niente di salvato', () => {
    useUserStore();

    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('regge un valore salvato diverso da un oggetto', () => {
    localStorage.setItem(KEY, JSON.stringify(null));

    expect(() => useUserStore()).not.toThrow();
  });

  it('butta via una chiave illeggibile invece di propagare l-errore', () => {
    localStorage.setItem(KEY, 'non-e-json');

    expect(() => useUserStore()).not.toThrow();
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it('non persiste il token nemmeno quando cambia', () => {
    const store = useUserStore();

    store.$patch({ role: 'Admin', userId: 7, token: 'jwt-nuovo' });

    expect(salvato()).toEqual({ role: 'Admin', userId: 7, company: null });
  });
});
