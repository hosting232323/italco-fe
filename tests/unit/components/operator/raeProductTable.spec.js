import { beforeEach, describe, expect, it, vi } from 'vitest';

import http from '@/utils/http';
import RaeProductTable from '@/components/operator/raeProducts/RaeProductTable.vue';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useUserStore } from '@/stores/user';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), downloadRequest: vi.fn(), withSessionToken: (url) => url }
}));

// La matita compare solo per un ritiro emesso di un ordine concluso.
const rigaLista = {
  id: 3,
  number: 12,
  status: 'Emitted',
  quantity: 1,
  link: null,
  order: { id: 20, status: 'Delivered', addressee: 'Vecchio' },
  product_group: { name: 'Frigoriferi', group_code: 'R1' },
  user: { company_name: 'Punto vendita' }
};
const ritiroAggiornato = { ...rigaLista, order: { ...rigaLista.order, addressee: 'Nuovo' }, dtr_date: '2026-10-16' };

let pinia;

const mountTable = () => {
  const store = useRaeProductStore();
  store.ready = true;
  store.list = [rigaLista];
  return mountComponent(RaeProductTable, { pinia, global: { stubs: { DisposalForm: true } } });
};

const editButton = (wrapper) => wrapper.find('.mdi-pencil');

const lastCall = () => http.makeRequest.mock.calls.at(-1);


beforeEach(() => {
  pinia = createTestPinia();
  useUserStore().company = { id: 1, name: 'Test', rae: true };
  vi.clearAllMocks();
});


describe('RaeProductTable, modifica ritiro', () => {
  it('ricarica il ritiro dal server con il filtro per id invece di usare la riga della lista', async () => {
    const wrapper = mountTable();

    await editButton(wrapper).trigger('click');

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['rae/product/filter', 'POST']);
    expect(payload.body).toEqual({ filters: [{ model: 'RaeProduct', field: 'id', value: 3 }] });
    expect(wrapper.emitted('open-dialog')).toBeUndefined();
  });

  it('apre il form con il ritiro ricevuto dal server', async () => {
    const wrapper = mountTable();
    await editButton(wrapper).trigger('click');

    lastCall().at(-1)({ status: 'ok', rae_products: [ritiroAggiornato] });

    expect(useRaeProductStore().element).toEqual(ritiroAggiornato);
    expect(useRaeProductStore().element).not.toBe(rigaLista);
    expect(wrapper.emitted('open-dialog')).toHaveLength(1);
  });

  it('avvisa e non apre il form se il ritiro non c-e- piu-', async () => {
    const wrapper = mountTable();
    await editButton(wrapper).trigger('click');

    lastCall().at(-1)({ status: 'ok', rae_products: [] });

    expect(alert).toHaveBeenCalledWith('Ritiro non trovato, ricarica la pagina');
    expect(wrapper.emitted('open-dialog')).toBeUndefined();
  });

  it('mostra il messaggio del backend quando risponde ko', async () => {
    const wrapper = mountTable();
    await editButton(wrapper).trigger('click');

    lastCall().at(-1)({ status: 'ko', message: 'Modulo RAEE non attivo per questa attività' });

    expect(alert).toHaveBeenCalledWith('Modulo RAEE non attivo per questa attività');
    expect(wrapper.emitted('open-dialog')).toBeUndefined();
  });
});
