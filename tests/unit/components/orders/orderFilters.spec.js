import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import http from '@/utils/http';
import OrderFilters from '@/components/orders/OrderFilters.vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), downloadRequest: vi.fn() }
}));

const mountFilters = (dates) => {
  const pinia = createTestPinia();
  useUserStore().role = 'Customer';
  const orderStore = useOrderStore();
  orderStore.ready = true;
  const wrapper = mountComponent(OrderFilters, {
    pinia,
    global: { stubs: { OperatorFilters: true } },
    attachTo: document.body
  });
  return { wrapper, orderStore, dates };
};

// Il contenuto del pannello esiste solo dopo la prima apertura.
const open = async ({ wrapper, orderStore, dates }) => {
  await wrapper.find('.v-expansion-panel-title').trigger('click');
  await flushPromises();
  orderStore.filtersSetting.doubleDates = true;
  orderStore.filters['Order.booking_date'] = dates;
  await flushPromises();
  return wrapper;
};

const exportButton = (wrapper) => wrapper.findAll('button').find(b => b.text().includes('Esporta Fatturazione'));


describe('OrderFilters, export fatturazione', () => {
  beforeEach(() => vi.clearAllMocks());

  it('non esporta un intervallo con la data di fine precedente a quella di inizio', async () => {
    const wrapper = await open(mountFilters(['2026-10-01', '2026-09-30']));
    await flushPromises();

    await exportButton(wrapper).trigger('click');
    await flushPromises();

    expect(http.downloadRequest).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('esporta un intervallo valido', async () => {
    const wrapper = await open(mountFilters(['2026-09-01', '2026-09-30']));
    await flushPromises();

    await exportButton(wrapper).trigger('click');
    await flushPromises();

    expect(http.downloadRequest).toHaveBeenCalledTimes(1);
    wrapper.unmount();
  });
});
