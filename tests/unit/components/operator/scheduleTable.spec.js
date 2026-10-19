import { beforeEach, describe, expect, it, vi } from 'vitest';

import http from '@/utils/http';
import ScheduleTable from '@/components/operator/schedules/ScheduleTable.vue';
import { useScheduleStore } from '@/stores/schedule';

import { createTestPinia, mountComponent, selectRow } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), downloadRequest: vi.fn() }
}));

// La riga della lista: puo' essere vecchia o con gli item incompleti
// (incidente 18599), e il form non deve partire da lei.
const rigaLista = { id: 5, date: '2026-10-25', users: [], transport: { name: 'Furgone' }, schedule_items: [] };
const borderoCompleto = {
  id: 5,
  date: '2026-10-30',
  users: [{ nickname: 'driver1' }],
  transport: { name: 'Furgone' },
  schedule_items: [{ index: 0, operation_type: 'Order', order_id: 20, address: 'Via Roma 1' }]
};

let pinia;

const mountTable = () => {
  const store = useScheduleStore();
  store.ready = true;
  store.list = [rigaLista];
  return mountComponent(ScheduleTable, { pinia });
};

const editButton = async (wrapper) => {
  await selectRow(wrapper);
  return wrapper.find('.mdi-pencil');
};

const lastCall = () => http.makeRequest.mock.calls.at(-1);


beforeEach(() => {
  pinia = createTestPinia();
  vi.clearAllMocks();
});


describe('ScheduleTable, modifica bordero', () => {
  it('ricarica il bordero dal server con il filtro per id invece di usare la riga della lista', async () => {
    const wrapper = mountTable();

    await (await editButton(wrapper)).trigger('click');

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['schedule/filter', 'POST']);
    expect(payload.body).toEqual({ filters: [{ model: 'Schedule', field: 'id', value: 5 }] });
    expect(wrapper.emitted('open-dialog')).toBeUndefined();
  });

  it('apre il form con il bordero completo ricevuto dal server', async () => {
    const wrapper = mountTable();
    await (await editButton(wrapper)).trigger('click');

    lastCall().at(-1)({ status: 'ok', schedules: [borderoCompleto] });

    expect(useScheduleStore().element).toEqual(borderoCompleto);
    expect(useScheduleStore().element).not.toBe(rigaLista);
    expect(wrapper.emitted('open-dialog')).toHaveLength(1);
  });

  it('avvisa e non apre il form se il bordero non c-e- piu-', async () => {
    const wrapper = mountTable();
    await (await editButton(wrapper)).trigger('click');

    lastCall().at(-1)({ status: 'ok', schedules: [] });

    expect(alert).toHaveBeenCalledWith('Borderò non trovato, ricarica la pagina');
    expect(wrapper.emitted('open-dialog')).toBeUndefined();
  });

  it('mostra il messaggio del backend quando risponde ko', async () => {
    const wrapper = mountTable();
    await (await editButton(wrapper)).trigger('click');

    lastCall().at(-1)({ status: 'ko', message: 'Filtro non valido' });

    expect(alert).toHaveBeenCalledWith('Filtro non valido');
    expect(wrapper.emitted('open-dialog')).toBeUndefined();
  });

  it('mostra il caricamento sulla matita finche- il server non risponde', async () => {
    const wrapper = mountTable();
    await (await editButton(wrapper)).trigger('click');

    expect(wrapper.find('button.v-btn--loading').exists()).toBe(true);

    lastCall().at(-1)({ status: 'ok', schedules: [borderoCompleto] });
    await wrapper.vm.$nextTick();

    expect(wrapper.find('button.v-btn--loading').exists()).toBe(false);
  });
});
