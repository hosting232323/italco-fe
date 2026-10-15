import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import http from '@/utils/http';
import ServicePopUp from '@/components/administration/services/ServicePopUp.vue';
import ServicePopUpForm from '@/components/administration/services/ServicePopUpForm.vue';
import ServicePopUpTable from '@/components/administration/services/ServicePopUpTable.vue';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useServiceStore } from '@/stores/service';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;
let store;

const service = (users = []) => ({ id: 2, name: 'Consegna', users });


beforeEach(() => {
  pinia = createTestPinia();
  store = useServiceStore();
  store.element = service();
  const users = useAdministrationUserStore();
  users.ready = true;
  users.list = [
    { id: 7, nickname: 'mario', role: 'Customer' },
    { id: 8, nickname: 'admin', role: 'Admin' }
  ];
  window.innerWidth = 1280;
  vi.clearAllMocks();
});


describe('ServicePopUp', () => {
  it('intitola il popup sul servizio aperto', () => {
    const wrapper = mountComponent(ServicePopUp, { pinia });

    expect(wrapper.text()).toContain('Utenti associati');
    expect(wrapper.text()).toContain('Servizio: Consegna');
  });

  it('mostra la tabella solo quando ci sono utenti', () => {
    expect(mountComponent(ServicePopUp, { pinia }).findComponent(ServicePopUpTable).exists()).toBe(false);

    store.element = service([{ id: 1, nickname: 'mario', price: 10 }]);

    expect(mountComponent(ServicePopUp, { pinia }).findComponent(ServicePopUpTable).exists()).toBe(true);
  });

  it('senza utenti propone di associarli tutti', async () => {
    const wrapper = mountComponent(ServicePopUp, { pinia });

    expect(wrapper.text()).toContain('Associa tutti gli utenti');

    await wrapper.find('input[type="number"]').setValue('15');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(http.makeRequest).toHaveBeenCalledWith(
      'service/set-all-users',
      'GET',
      { params: { service_id: 2, price: '15' } },
      expect.any(Function)
    );
  });

  it('non associa nulla senza prezzo', async () => {
    const wrapper = mountComponent(ServicePopUp, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(http.makeRequest).not.toHaveBeenCalledWith(
      'service/set-all-users',
      expect.anything(),
      expect.anything(),
      expect.anything()
    );
  });

  it('alla risposta ok riempie gli utenti del servizio', async () => {
    const wrapper = mountComponent(ServicePopUp, { pinia });
    await wrapper.find('input[type="number"]').setValue('15');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    const callback = http.makeRequest.mock.calls.at(-1)[3];

    callback({ status: 'ok', service_users: [{ id: 1, nickname: 'mario' }] });

    expect(store.element.users).toEqual([{ id: 1, nickname: 'mario' }]);
  });

  it('il piu apre il form di associazione', async () => {
    const wrapper = mountComponent(ServicePopUp, { pinia });

    await wrapper.find('.mdi-plus').trigger('click');

    expect(store.activePopUpForm).toBe(true);
  });
});


describe('ServicePopUpForm', () => {
  const openForm = () => {
    store.activePopUpForm = true;
    return mountComponent(ServicePopUpForm, { pinia });
  };

  it('resta chiuso finche non lo si apre', () => {
    expect(mountComponent(ServicePopUpForm, { pinia }).find('form').exists()).toBe(false);
  });

  it('propone solo i clienti', () => {
    const wrapper = openForm();

    const items = wrapper.findComponent({ name: 'VAutocomplete' }).props('items');
    expect(items.map(({ nickname }) => nickname)).toEqual(['mario']);
  });

  it('non invia nulla senza utente e prezzo', async () => {
    const create = vi.spyOn(store, 'createServiceUserRelationships');
    const wrapper = openForm();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(create).not.toHaveBeenCalled();
  });

  it('crea l-associazione quando il form e valido', async () => {
    const create = vi.spyOn(store, 'createServiceUserRelationships').mockImplementation(() => {});
    store.innerElement = { user_id: 7, price: 10 };
    const wrapper = openForm();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(create).toHaveBeenCalledWith({ user_id: 7, price: 10 }, expect.any(Function));
  });

  it('aggiorna l-associazione gia esistente', async () => {
    const update = vi.spyOn(store, 'updateServiceUserRelationships').mockImplementation(() => {});
    store.innerElement = { id: 3, user_id: 7, price: 10 };
    const wrapper = openForm();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(update).toHaveBeenCalledOnce();
  });

  it('mostra il messaggio di errore del backend', async () => {
    const create = vi.spyOn(store, 'createServiceUserRelationships').mockImplementation(() => {});
    store.innerElement = { user_id: 7, price: 10 };
    const wrapper = openForm();
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    create.mock.calls.at(-1)[1]({ status: 'ko', message: 'Utente gia associato' });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Utente gia associato');
  });

  it('non permette di cambiare utente in modifica', () => {
    store.innerElement = { id: 3, user_id: 7, price: 10 };

    expect(openForm().findComponent({ name: 'VAutocomplete' }).props('disabled')).toBeTruthy();
  });
});


describe('ServicePopUpTable', () => {
  beforeEach(() => {
    store.element = service([
      { id: 1, nickname: 'mario', price: 10, code: 'A1' },
      { id: 2, nickname: 'anna', price: 12, code: 'A2' }
    ]);
  });

  it('mostra una riga per utente associato', () => {
    expect(mountComponent(ServicePopUpTable, { pinia }).findAll('tbody tr')).toHaveLength(2);
  });

  it('la matita apre il form sull-associazione scelta', async () => {
    const wrapper = mountComponent(ServicePopUpTable, { pinia });

    await wrapper.findAll('tbody tr')[0].find('.mdi-pencil').trigger('click');

    expect(store.innerElement).toEqual({ id: 1, nickname: 'mario', price: 10, code: 'A1' });
    expect(store.activePopUpForm).toBe(true);
  });

  it('il cestino scollega l-utente dal servizio', async () => {
    const remove = vi.spyOn(store, 'deleteServiceUserRelationships').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(ServicePopUpTable, { pinia });

    await wrapper.findAll('tbody tr')[0].find('.mdi-delete').trigger('click');
    remove.mock.calls.at(-1)[1]();

    expect(store.element.users.map(({ id }) => id)).toEqual([2]);
    expect(initList).toHaveBeenCalled();
  });
});
