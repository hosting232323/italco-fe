import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import TransportForm from '@/components/administration/transports/TransportForm.vue';
import TransportTable from '@/components/administration/transports/TransportTable.vue';
import DeliveryUserInfoTable from '@/components/administration/transports/DeliveryUserInfoTable.vue';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { createTestPinia, mountComponent } from '../../helpers/mount';


const VALID_TRANSPORT = {
  name: 'Furgone',
  plate: 'AA111BB',
  address: 'Via Deposito 1, Bisceglie, BT',
  cap: '70020'
};


const openForm = (element = {}) => {
  const pinia = createTestPinia();
  const store = useTransportStore();
  const userStore = useAdministrationUserStore();
  userStore.ready = true;
  userStore.list = [];
  store.activeForm = true;
  store.element = element;
  return { pinia, store, wrapper: mountComponent(TransportForm, { pinia }) };
};


describe('TransportForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('la localita e un indirizzo con autocomplete, non una tendina di comuni', () => {
    const { wrapper } = openForm({ ...VALID_TRANSPORT });

    expect(wrapper.text()).toContain('Indirizzo');
    expect(wrapper.text()).not.toContain('Località');
  });

  it('scrive indirizzo e cap dai componenti scelti nell-autocomplete', async () => {
    const { store, wrapper } = openForm({ name: 'Furgone', plate: 'AA111BB' });

    wrapper.findComponent({ name: 'AddressAutocomplete' }).vm.$emit('addressComponents', {
      address: 'Via Deposito 1, Bisceglie, BT',
      cap: '76011'
    });
    await flushPromises();

    expect(store.element.address).toBe('Via Deposito 1, Bisceglie, BT');
    expect(store.element.cap).toBe('76011');
  });

  it('non invia nulla senza indirizzo', async () => {
    const { store, wrapper } = openForm({ name: 'Furgone', plate: 'AA111BB' });
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(createElement).not.toHaveBeenCalled();
  });
});


describe('TransportTable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra l-indirizzo del veicolo con il suo cap', () => {
    const pinia = createTestPinia();
    const store = useTransportStore();
    store.ready = true;
    store.list = [{ id: 1, ...VALID_TRANSPORT, delivery_users: [{ id: 3, nickname: 'mario' }] }];

    const wrapper = mountComponent(TransportTable, { pinia });

    expect(wrapper.text()).toContain('Via Deposito 1, Bisceglie, BT (70020)');
    expect(wrapper.text()).toContain('mario');
  });
});


describe('DeliveryUserInfoTable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra il veicolo dell-utente delivery al posto della localita', () => {
    const pinia = createTestPinia();
    const transportStore = useTransportStore();
    transportStore.ready = true;
    transportStore.list = [{ id: 9, ...VALID_TRANSPORT }];
    const userStore = useAdministrationUserStore();
    userStore.ready = true;
    userStore.list = [
      { id: 1, nickname: 'mario', role: 'Delivery', delivery_user_info: { transport_id: 9 } },
      { id: 2, nickname: 'luigi', role: 'Delivery', delivery_user_info: {} }
    ];

    const wrapper = mountComponent(DeliveryUserInfoTable, { pinia });

    expect(wrapper.text()).not.toContain('Località');
    expect(wrapper.text()).toContain('Furgone');
    // Chi non sta su nessun veicolo resta in tabella, senza mezzo.
    expect(wrapper.text()).toContain('luigi');
    // Niente matita: la localita non si modifica piu da qui.
    expect(wrapper.find('.mdi-pencil').exists()).toBe(false);
  });
});
