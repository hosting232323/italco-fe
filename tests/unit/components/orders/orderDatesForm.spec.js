import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import OrderDatesForm from '@/components/orders/OrderDatesForm.vue';
import DpcCalendarField from '@/components/orders/DpcCalendarField.vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import http from '@/utils/http';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const mountForm = async (constraints) => {
  http.makeRequest.mockImplementation((url, method, options, callback) => {
    if (url === 'check-constraints') callback({ status: 'ok', ...constraints });
  });
  const pinia = createTestPinia();
  const userStore = useUserStore();
  userStore.role = 'Customer';
  userStore.company = { automatic_planning: true };
  userStore.automaticPlanning = true;
  useOrderStore().element = { cap: '70051', products: {} };
  const wrapper = mountComponent(OrderDatesForm, { pinia });
  await flushPromises();
  return wrapper;
};

describe('OrderDatesForm con pianificazione automatica', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra il calendario a fasce quando ci sono date disponibili', async () => {
    const wrapper = await mountForm({
      dates: ['2099-01-05'],
      slots: { '2099-01-05': [{ start: '08:00', end: '12:00' }] },
      covered: true
    });

    expect(wrapper.findComponent(DpcCalendarField).exists()).toBe(true);
  });

  it('fuori copertura ripiega sulla data manuale con ogni giorno selezionabile', async () => {
    const wrapper = await mountForm({ dates: [], slots: {}, covered: false });

    expect(wrapper.findComponent(DpcCalendarField).exists()).toBe(false);
    const field = wrapper.findAllComponents({ name: 'DateField' })[0];
    expect(field.props('allowedDates').length).toBeGreaterThan(0);
  });

  it('con le fasce esaurite resta il calendario, senza date', async () => {
    const wrapper = await mountForm({ dates: [], slots: {}, covered: true });

    expect(wrapper.findComponent(DpcCalendarField).exists()).toBe(true);
    expect(wrapper.findComponent(DpcCalendarField).props('allowedDates')).toEqual([]);
  });
});
