import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import OrderProductServiceInput from '@/components/orders/OrderProductServiceInput.vue';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;

// La riga vive su una griglia da 12 colonne: quello che conta e' la larghezza
// di ogni campo, non quale campo la occupa.
const columnWidths = (wrapper) => wrapper.findAll('.v-row > .v-col-md-4, .v-row > .v-col-md-3, .v-row > .v-col-md-2')
  .map(col => Number(col.classes().find(cls => cls.startsWith('v-col-md-')).split('-').at(-1)));

const errorTexts = (wrapper) => wrapper.findAll('.v-messages__message').map(message => message.text());

const clickAdd = async (wrapper) => {
  await wrapper.find('.v-input__prepend .v-icon').trigger('click');
  await flushPromises();
};

const toggleRae = (wrapper) => wrapper.findComponent({ name: 'VCheckbox' }).vm.$emit('update:modelValue', true);


beforeEach(() => {
  pinia = createTestPinia();
  const userStore = useUserStore();
  userStore.role = 'Admin';
  userStore.company = { id: 1, name: 'Test', rae: true };
  useOrderStore().element = { type: 'Delivery', user_id: 3 };
  window.innerWidth = 1280;
  vi.clearAllMocks();
});


describe('OrderProductServiceInput', () => {
  it('apre la riga con prodotto, servizio, punto di ritiro e spunta RAEE', () => {
    const wrapper = mountComponent(OrderProductServiceInput, { pinia });

    expect(columnWidths(wrapper)).toEqual([4, 3, 3, 2]);
  });

  it('mantiene le stesse larghezze passando al prodotto RAEE', async () => {
    const wrapper = mountComponent(OrderProductServiceInput, { pinia });
    const before = columnWidths(wrapper);

    await toggleRae(wrapper);

    expect(wrapper.text()).toContain('Quantità');
    expect(columnWidths(wrapper)).toEqual(before);
  });

  it('senza il modulo RAEE divide la riga in tre campi uguali', () => {
    useUserStore().company = { id: 1, name: 'Test', rae: false };

    const wrapper = mountComponent(OrderProductServiceInput, { pinia });

    expect(columnWidths(wrapper)).toEqual([4, 4, 4]);
  });

  it('dopo il «+» aggiunge il prodotto e lascia i campi vuoti senza errori', async () => {
    const wrapper = mountComponent(OrderProductServiceInput, { pinia });
    const service = { id: 1, name: 'Consegna', type: 'Delivery' };
    const collectionPoint = { id: 2, name: 'Magazzino', user_id: 3 };

    await wrapper.findComponent({ name: 'VTextField' }).vm.$emit('update:modelValue', 'Frigorifero');
    await wrapper.findComponent({ name: 'VSelect' }).vm.$emit('update:modelValue', service);
    await wrapper.findComponent({ name: 'VAutocomplete' }).vm.$emit('update:modelValue', collectionPoint);
    await clickAdd(wrapper);

    expect(useOrderStore().element.products.Frigorifero.collection_point).toEqual(collectionPoint);
    expect(wrapper.findComponent({ name: 'VTextField' }).props('modelValue')).toBeNull();
    expect(wrapper.findComponent({ name: 'VSelect' }).props('modelValue')).toBeNull();
    expect(wrapper.findComponent({ name: 'VAutocomplete' }).props('modelValue')).toBeNull();
    expect(errorTexts(wrapper)).toEqual([]);
    expect(wrapper.find('.v-input--error').exists()).toBe(false);
  });

  it('con i campi vuoti il «+» non aggiunge nulla e mostra le regole', async () => {
    const wrapper = mountComponent(OrderProductServiceInput, { pinia });

    await clickAdd(wrapper);

    expect(useOrderStore().element.products).toBeUndefined();
    expect(errorTexts(wrapper).length).toBe(3);
  });
});
