import { beforeEach, describe, expect, it, vi } from 'vitest';

import http from '@/utils/http';
import OrderActions from '@/components/orders/OrderActions.vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), downloadRequest: vi.fn() }
}));

// I popup della dialog hanno store propri e non c'entrano con la modifica.
const stubs = {
  ChangeOrderUser: true,
  MoveOrderCompany: true,
  OrderDeliverySummary: true
};

// La riga della lista: puo' essere vecchia, il form non deve partire da lei.
const rigaLista = { id: 20, status: 'Booked', addressee: 'Vecchio', products: {}, user: { id: 7 } };
const ordineAggiornato = { id: 20, status: 'Booked', addressee: 'Nuovo', products: {}, user: { id: 7 } };

let pinia;

const mountActions = () => mountComponent(OrderActions, { pinia, props: { item: rigaLista }, global: { stubs } });

const editButton = (wrapper) => wrapper.findAll('button').find(button => button.text().includes('Modifica'));

const lastCall = () => http.makeRequest.mock.calls.at(-1);


beforeEach(() => {
  pinia = createTestPinia();
  useUserStore().role = 'Admin';
  vi.clearAllMocks();
});


describe('OrderActions, modifica ordine', () => {
  it('ricarica l-ordine dal server con il filtro per id invece di usare la riga della lista', async () => {
    const wrapper = mountActions();

    await editButton(wrapper).trigger('click');

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['order/filter', 'POST']);
    expect(payload.body).toEqual({ filters: [{ model: 'Order', field: 'id', value: 20 }] });
    expect(useOrderStore().activeForm).toBe(false);
  });

  it('apre il form con l-ordine ricevuto dal server', async () => {
    const wrapper = mountActions();
    await editButton(wrapper).trigger('click');

    lastCall().at(-1)({ status: 'ok', orders: [ordineAggiornato] });

    const orderStore = useOrderStore();
    expect(orderStore.element).toEqual({ ...ordineAggiornato, user_id: 7 });
    expect(orderStore.element.addressee).toBe('Nuovo');
    expect(orderStore.activeForm).toBe(true);
    expect(orderStore.addressValid).toBe(true);
  });

  it('avvisa e non apre il form se l-ordine non c-e- piu-', async () => {
    const wrapper = mountActions();
    await editButton(wrapper).trigger('click');

    lastCall().at(-1)({ status: 'ok', orders: [] });

    expect(alert).toHaveBeenCalledWith('Ordine non trovato, ricarica la pagina');
    expect(useOrderStore().activeForm).toBe(false);
  });

  it('mostra il messaggio del backend quando risponde ko', async () => {
    const wrapper = mountActions();
    await editButton(wrapper).trigger('click');

    lastCall().at(-1)({ status: 'ko', message: 'Ordine di un-altra attivita-' });

    expect(alert).toHaveBeenCalledWith('Ordine di un-altra attivita-');
    expect(useOrderStore().activeForm).toBe(false);
  });

  it('mostra il caricamento sul pulsante finche- il server non risponde', async () => {
    const wrapper = mountActions();
    await editButton(wrapper).trigger('click');

    expect(editButton(wrapper).classes()).toContain('v-btn--loading');

    lastCall().at(-1)({ status: 'ok', orders: [ordineAggiornato] });
    await wrapper.vm.$nextTick();

    expect(editButton(wrapper).classes()).not.toContain('v-btn--loading');
  });
});
