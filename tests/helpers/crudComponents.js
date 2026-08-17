import { flushPromises } from '@vue/test-utils';
import { expect, it, vi } from 'vitest';

import { createTestPinia, mountComponent } from './mount';


/**
 * Tabelle e form delle anagrafiche sono lo stesso componente ripetuto: la
 * tabella legge la lista dallo store, apre il form sulla matita e cancella sul
 * cestino; il form crea o aggiorna a seconda che l'elemento abbia un id e alla
 * risposta ok si richiude ricaricando la lista. Qui c'e' il contratto comune,
 * ogni componente dichiara solo cosa lo distingue.
 */

const setup = (useStore) => {
  const pinia = createTestPinia();
  return { pinia, store: useStore() };
};

const rowsOf = (wrapper) => wrapper.findAll('tbody tr');


export const describeCrudTable = ({ component, useStore, items, ready = true }) => {
  const mountTable = (store, pinia) => {
    store.ready = ready;
    store.list = items;
    return mountComponent(component, { pinia });
  };

  it('mostra lo scheletro finche la lista non e pronta', () => {
    const { pinia, store } = setup(useStore);
    store.ready = false;

    const wrapper = mountComponent(component, { pinia });

    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
    expect(wrapper.find('.v-data-table').exists()).toBe(false);
  });

  it('mostra una riga per elemento', () => {
    const { pinia, store } = setup(useStore);

    const wrapper = mountTable(store, pinia);

    expect(rowsOf(wrapper)).toHaveLength(items.length);
  });

  it('la matita apre il form sull-elemento scelto', async () => {
    const { pinia, store } = setup(useStore);
    const wrapper = mountTable(store, pinia);

    await rowsOf(wrapper)[0].find('.mdi-pencil').trigger('click');

    expect(store.element).toEqual(items[0]);
    expect(store.activeForm).toBe(true);
  });

  it('il cestino cancella l-elemento e ricarica la lista', async () => {
    const { pinia, store } = setup(useStore);
    const deleteElement = vi.spyOn(store, 'deleteElement');
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountTable(store, pinia);

    await rowsOf(wrapper)[0].find('.mdi-delete').trigger('click');

    expect(deleteElement).toHaveBeenCalledWith(items[0], expect.any(Function));

    deleteElement.mock.calls.at(-1)[1]({ status: 'ok' });

    expect(initList).toHaveBeenCalled();
  });
};


export const describeCrudForm = ({
  component,
  useStore,
  validElement,
  createTitle,
  updateTitle,
  update = true
}) => {
  const mountForm = (store, pinia, element = {}) => {
    store.activeForm = true;
    store.element = element;
    return mountComponent(component, { pinia });
  };

  const submit = async (wrapper) => {
    await wrapper.find('form').trigger('submit');
    await flushPromises();
  };

  it('resta chiuso finche non lo si apre', () => {
    const { pinia, store } = setup(useStore);
    store.activeForm = false;

    expect(mountComponent(component, { pinia }).find('form').exists()).toBe(false);
  });

  it('annuncia la creazione quando l-elemento e nuovo', () => {
    const { pinia, store } = setup(useStore);

    expect(mountForm(store, pinia).text()).toContain(createTitle);
  });

  if (update)
    it('annuncia la modifica quando l-elemento ha un id', () => {
      const { pinia, store } = setup(useStore);

      expect(mountForm(store, pinia, { ...validElement, id: 7 }).text()).toContain(updateTitle);
    });

  it('non invia nulla se i campi obbligatori sono vuoti', async () => {
    const { pinia, store } = setup(useStore);
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia);

    await submit(wrapper);

    expect(createElement).not.toHaveBeenCalled();
  });

  it('crea l-elemento quando il form e valido', async () => {
    const { pinia, store } = setup(useStore);
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...validElement });

    await submit(wrapper);

    expect(createElement).toHaveBeenCalledOnce();
  });

  if (update)
    it('aggiorna l-elemento gia esistente', async () => {
      const { pinia, store } = setup(useStore);
      const updateElement = vi.spyOn(store, 'updateElement').mockImplementation(() => {});
      const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
      const wrapper = mountForm(store, pinia, { ...validElement, id: 7 });

      await submit(wrapper);

      expect(updateElement).toHaveBeenCalledOnce();
      expect(createElement).not.toHaveBeenCalled();
    });

  it('alla risposta ok svuota il form, ricarica e chiude', async () => {
    const { pinia, store } = setup(useStore);
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...validElement });
    await submit(wrapper);

    createElement.mock.calls.at(-1)[0]({ status: 'ok' });

    expect(store.element).toEqual({});
    expect(store.activeForm).toBe(false);
    expect(initList).toHaveBeenCalled();
  });

  it('alla risposta ko lascia il form aperto', async () => {
    const { pinia, store } = setup(useStore);
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...validElement });
    await submit(wrapper);

    createElement.mock.calls.at(-1)[0]({ status: 'ko', message: 'errore' });

    expect(store.activeForm).toBe(true);
    expect(store.element).toMatchObject(validElement);
  });

  it('il pulsante di annullamento chiude il form', async () => {
    const { pinia, store } = setup(useStore);
    const wrapper = mountForm(store, pinia, { ...validElement });

    await wrapper.findComponent({ name: 'FormButtons' }).vm.$emit('cancel');

    expect(store.activeForm).toBe(false);
  });
};
