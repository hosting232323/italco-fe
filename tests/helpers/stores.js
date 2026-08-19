import { expect, it, vi } from 'vitest';

import http from '@/utils/http';


/**
 * Quasi tutti gli store sono lo stesso CRUD sopra http.makeRequest, con in piu'
 * il debounce di storesUtils.refreshList. Invece di ripetere gli stessi test
 * diciassette volte, ogni store dichiara il suo contratto e qui si verifica.
 */
export const describeCrudStore = ({
  useStore,
  endpoint,
  listKey,
  create = true,
  update = true,
  remove = true,
  excludedKeys = [],
  listMethod = 'GET',
  listEndpoint = endpoint,
  listBody = {}
}) => {
  const lastCall = () => http.makeRequest.mock.calls.at(-1);

  it('parte con una lista vuota e non ancora pronta', () => {
    const store = useStore();

    expect(store.list).toEqual([]);
    expect(store.ready).toBe(false);
  });

  it('chiede la lista al backend', () => {
    const store = useStore();

    store.initList();
    vi.advanceTimersByTime(50);

    const [url, method, payload] = lastCall();
    expect(url).toBe(listEndpoint);
    expect(method).toBe(listMethod);
    if (listMethod !== 'GET') expect(payload.body).toEqual(listBody);
  });

  it('salva la lista ricevuta e si segna pronta', () => {
    const store = useStore();

    store.setList({ [listKey]: [{ id: 1 }, { id: 2 }] });

    expect(store.list).toEqual([{ id: 1 }, { id: 2 }]);
    expect(store.ready).toBe(true);
  });

  if (create)
    it('crea un elemento con il contenuto del form', () => {
      const store = useStore();
      store.element = { name: 'Nuovo' };

      store.createElement(vi.fn());

      const [url, method, payload] = lastCall();
      expect([url, method]).toEqual([endpoint, 'POST']);
      expect(payload.body).toMatchObject({ name: 'Nuovo' });
    });

  if (update)
    it('aggiorna l-elemento sul suo id', () => {
      const store = useStore();
      store.element = { id: 7, name: 'Aggiornato' };

      store.updateElement(vi.fn());

      const [url, method, payload] = lastCall();
      expect([url, method]).toEqual([`${endpoint}/7`, 'PUT']);
      expect(payload.body).toMatchObject({ name: 'Aggiornato' });
    });

  if (update && excludedKeys.length)
    it('non rimanda al backend i campi di sola lettura', () => {
      const store = useStore();
      store.element = {
        id: 7,
        name: 'Aggiornato',
        ...Object.fromEntries(excludedKeys.map((key) => [key, 'da-scartare']))
      };

      store.updateElement(vi.fn());

      const [, , payload] = lastCall();
      excludedKeys.forEach((key) => expect(payload.body).not.toHaveProperty(key));
      expect(payload.body).toMatchObject({ id: 7, name: 'Aggiornato' });
    });

  if (remove)
    it('cancella l-elemento passato', () => {
      const store = useStore();
      const func = vi.fn();

      store.deleteElement({ id: 9 }, func);

      const [url, method, , callback] = lastCall();
      expect([url, method]).toEqual([`${endpoint}/9`, 'DELETE']);
      expect(callback).toBe(func);
    });

  if (create)
    it('inoltra al backend la callback ricevuta', () => {
      const store = useStore();
      const func = vi.fn();

      store.createElement(func);

      expect(lastCall().at(-1)).toBe(func);
    });
};
