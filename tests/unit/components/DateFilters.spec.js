import { beforeEach, describe, expect, it, vi } from 'vitest';

import DateFilters from '@/components/DateFilters.vue';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useUserStore } from '@/stores/user';

import { createTestPinia, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;

const mountFilters = (props = {}) => mountComponent(DateFilters, {
  pinia,
  props: { element: 'Order', filterTypes: storesUtils.ORDER_DATE_FILTER_TYPES, ...props }
});

const dateInputs = (wrapper) => wrapper.findAll('input[type="date"]');
const typeSelect = (wrapper) => wrapper.findComponent({ name: 'VSelect' });


describe('DateFilters', () => {
  beforeEach(() => {
    pinia = createTestPinia();
    window.innerWidth = 1280;
  });

  it('prepara il filtro del tipo di data selezionato', () => {
    const store = useOrderStore();

    mountFilters();

    expect(store.filters['Order.work_date']).toEqual([null, null]);
  });

  it('parte da una sola data', () => {
    const wrapper = mountFilters();

    expect(dateInputs(wrapper)).toHaveLength(1);
  });

  it('apre e chiude l-intervallo di date', async () => {
    const store = useOrderStore();
    const wrapper = mountFilters();

    await wrapper.find('.v-input__prepend .v-icon').trigger('click');

    expect(store.filtersSetting.doubleDates).toBe(true);
    expect(dateInputs(wrapper)).toHaveLength(2);

    await wrapper.find('.v-input__prepend .v-icon').trigger('click');

    expect(store.filtersSetting.doubleDates).toBe(false);
  });

  it('scrive la data scelta nei filtri dello store', async () => {
    const store = useOrderStore();
    const wrapper = mountFilters();

    await dateInputs(wrapper)[0].setValue('2026-09-01');

    expect(store.filters['Order.work_date'][0]).toBe('2026-09-01');
  });

  it('cambiando tipo di data sposta il filtro', async () => {
    const store = useOrderStore();
    const wrapper = mountFilters();
    store.filters['Order.work_date'] = ['2026-09-01', null];

    await typeSelect(wrapper).vm.$emit('update:modelValue', 'dpc');

    expect(store.filters).not.toHaveProperty('Order.work_date');
    expect(store.filters['Order.dpc']).toEqual([null, null]);
  });

  it('usa lo store del bordero quando l-elemento e Schedule', () => {
    const scheduleStore = useScheduleStore();

    mountFilters({ element: 'Schedule', filterTypes: storesUtils.SCHEDULE_DATE_FILTER_TYPES });

    expect(scheduleStore.filters['Schedule.date']).toEqual([null, null]);
  });

  it('blocca la scelta quando c-e un solo tipo di data', () => {
    const wrapper = mountFilters({ element: 'Log', filterTypes: storesUtils.LOG_DATE_FILTER_TYPES });

    expect(typeSelect(wrapper).props('disabled')).toBe(true);
  });

  it('al cliente mostra solo le date che lo riguardano', () => {
    const store = useOrderStore();
    useUserStore().role = 'Customer';
    store.filtersSetting.dateType = 'dpc';

    const wrapper = mountFilters();

    const tipi = typeSelect(wrapper).props('items').map(({ value }) => value);
    expect(tipi).toEqual(['dpc', 'drc', 'created_at']);
  });

  it('il cliente non riesce ad aprire i filtri appena caricata la pagina', () => {
    // BUG: il tipo di data di partenza e' work_date (primo di
    // ORDER_DATE_FILTER_TYPES), che pero' per il ruolo Customer viene filtrato
    // via: dateFilterTypes[dateType] e' undefined e il componente esplode in
    // setup. Succede a ogni cliente, perche' filtersSetting non e' persistito.
    useUserStore().role = 'Customer';

    expect(() => mountFilters()).toThrow(TypeError);
  });

  it('agli operatori mostra tutti i tipi di data', () => {
    useUserStore().role = 'Admin';

    const wrapper = mountFilters();

    expect(typeSelect(wrapper).props('items')).toHaveLength(
      Object.keys(storesUtils.ORDER_DATE_FILTER_TYPES).length
    );
  });

  it('accetta anche input datetime', () => {
    const wrapper = mountFilters({ dateInputType: 'datetime-local' });

    expect(wrapper.findAll('input[type="datetime-local"]')).toHaveLength(1);
  });
});
