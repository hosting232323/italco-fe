import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';

import OrderTable from '@/components/orders/OrderTable.vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { useScheduleStore } from '@/stores/schedule';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), downloadRequest: vi.fn() }
}));

// I figli pesanti (form dello scheduling, popup) hanno store propri e non
// c'entrano con la visibilita' dei pulsanti d'azione: li stubbiamo.
const stubs = {
  Action: true,
  OrderInfoRow: true,
  OrderDatesForm: true,
  OrderHistoryPopup: true,
  ScheduleForm: true,
  SchedulationForm: true
};

let pinia;

const mountTable = () => mountComponent(OrderTable, { pinia, global: { stubs } });

// Il pulsante compare solo con almeno un ordine selezionato: OrderTable azzera
// lo schedule al setup, quindi lo si popola dopo il mount.
const withSelectedOrder = async () => {
  useScheduleStore().element = { orders: [{ id: 1 }] };
  await nextTick();
};


beforeEach(() => {
  pinia = createTestPinia();
  useOrderStore().ready = true;
  vi.clearAllMocks();
});


describe('OrderTable, permessi del super admin', () => {
  it('mostra "Crea Borderò" al super admin che opera in una company', async () => {
    const userStore = useUserStore();
    userStore.role = 'Super Admin';
    userStore.company = { id: 1, name: 'Test' };

    const wrapper = mountTable();
    await withSelectedOrder();

    expect(wrapper.text()).toContain('Crea Borderò');
    expect(wrapper.text()).toContain('Esporta');
  });

  it('non mostra le azioni di borderò al super admin senza company', async () => {
    useUserStore().role = 'Super Admin';

    const wrapper = mountTable();
    await withSelectedOrder();

    expect(wrapper.text()).not.toContain('Crea Borderò');
  });

  it('mostra "Crea Borderò" anche a un admin normale', async () => {
    const userStore = useUserStore();
    userStore.role = 'Admin';
    userStore.company = { id: 1, name: 'Test' };

    const wrapper = mountTable();
    await withSelectedOrder();

    expect(wrapper.text()).toContain('Crea Borderò');
  });
});
