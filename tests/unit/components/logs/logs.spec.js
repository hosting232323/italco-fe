import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import http from '@/utils/http';
import LogFilters from '@/components/administration/logs/LogFilters.vue';
import LogPopUp from '@/components/administration/logs/LogPopUp.vue';
import LogTable from '@/components/administration/logs/LogTable.vue';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useLogStore } from '@/stores/log';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;
let store;

const logRow = (extra = {}) => ({
  logs: { id: 1, created_at: '2026-09-01T08:30:15Z', method: 'POST', endpoint: '/order', ...extra },
  user: { email: 'mario' }
});


beforeEach(() => {
  pinia = createTestPinia();
  store = useLogStore();
  window.innerWidth = 1280;
  vi.clearAllMocks();
});


describe('LogTable', () => {
  const mountTable = (items = [logRow()]) => {
    store.ready = true;
    store.list = items;
    return mountComponent(LogTable, { pinia });
  };

  it('mostra lo scheletro finche la lista non e pronta', () => {
    store.ready = false;

    expect(mountComponent(LogTable, { pinia }).find('.v-skeleton-loader').exists()).toBe(true);
  });

  it('mostra metodo, endpoint e utente', () => {
    const testo = mountTable().find('tbody tr').text();

    expect(testo).toContain('POST');
    expect(testo).toContain('/order');
    expect(testo).toContain('mario');
  });

  it('formatta la data sul fuso di Roma', () => {
    expect(mountTable().find('tbody tr').text()).toContain('01/09/2026 10:30:15');
  });

  it('la lente apre il dettaglio del log', async () => {
    const wrapper = mountTable();

    await wrapper.find('.mdi-magnify-plus-outline').trigger('click');

    expect(store.selectedLog).toBe(1);
    expect(store.activePopUp).toBe(true);
  });
});


describe('LogFilters', () => {
  beforeEach(() => {
    const users = useAdministrationUserStore();
    users.ready = true;
    users.list = [{ id: 7, email: 'mario' }];
  });

  const panelIsOpen = (wrapper) => wrapper.find('.v-expansion-panel').classes().includes('v-expansion-panel--active');

  it('parte con il pannello chiuso', () => {
    expect(panelIsOpen(mountComponent(LogFilters, { pinia }))).toBe(false);
  });

  it('propone gli utenti nel filtro', async () => {
    const wrapper = mountComponent(LogFilters, { pinia });

    await wrapper.find('.v-expansion-panel-title').trigger('click');

    expect(wrapper.findComponent({ name: 'VAutocomplete' }).props('items')).toEqual([
      { id: 7, email: 'mario' }
    ]);
  });

  it('applicando i filtri ricarica la lista e richiude il pannello', async () => {
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    store.ready = true;
    const wrapper = mountComponent(LogFilters, { pinia });
    await wrapper.find('.v-expansion-panel-title').trigger('click');

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(store.ready).toBe(false);
    expect(initList).toHaveBeenCalled();
    expect(panelIsOpen(wrapper)).toBe(false);
  });
});


describe('LogPopUp', () => {
  const mountPopUp = (log) => {
    store.selectedLog = 1;
    const wrapper = mountComponent(LogPopUp, { pinia });
    http.makeRequest.mock.calls.at(-1)[3]({ status: 'ok', log });
    return wrapper;
  };

  it('chiede il log selezionato', () => {
    store.selectedLog = 42;

    mountComponent(LogPopUp, { pinia });

    expect(http.makeRequest).toHaveBeenCalledWith('log/42', 'GET', {}, expect.any(Function));
  });

  it('non mostra nulla finche la risposta non arriva', () => {
    store.selectedLog = 1;

    expect(mountComponent(LogPopUp, { pinia }).find('.v-card').exists()).toBe(false);
  });

  it('intitola con la data del log', async () => {
    const wrapper = mountPopUp({ created_at: '2026-09-01T08:30:15Z', content: '{}' });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Log del 01/09/2026 10:30:15');
  });

  it('mostra richiesta e risposta formattate', async () => {
    const wrapper = mountPopUp({
      created_at: '2026-09-01T08:30:15Z',
      content: JSON.stringify({ request: { id: 7 }, response: { status: 'ok' } })
    });
    await wrapper.vm.$nextTick();

    const testo = wrapper.text();
    expect(testo).toContain('"id": 7');
    expect(testo).toContain('"status": "ok"');
  });

  it('srotola le risposte annidate come stringhe json', async () => {
    const wrapper = mountPopUp({
      created_at: '2026-09-01T08:30:15Z',
      content: JSON.stringify({ request: {}, response: JSON.stringify({ orders: '[{"id": 1}]' }) })
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('"id": 1');
  });

  it('usa tutto il contenuto quando non c-e una richiesta separata', async () => {
    const wrapper = mountPopUp({
      created_at: '2026-09-01T08:30:15Z',
      content: JSON.stringify({ qualcosa: 'altro' })
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('"qualcosa": "altro"');
  });
});
