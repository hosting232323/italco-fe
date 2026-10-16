import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ConstraintPopUp from '@/components/administration/sellingPoints/ConstraintPopUp.vue';
import ConstraintPopUpForm from '@/components/administration/sellingPoints/ConstraintPopUpForm.vue';
import ConstraintPopUpTable from '@/components/administration/sellingPoints/ConstraintPopUpTable.vue';
import { useGeographicZoneStore } from '@/stores/geographicZone';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;
let store;

const fillForm = async (wrapper, { day = 0, maxOrders = '5' } = {}) => {
  await wrapper.findComponent({ name: 'VSelect' }).vm.$emit('update:modelValue', day);
  await wrapper.find('input[type="number"]').setValue(maxOrders);
  await wrapper.find('form').trigger('submit');
  await flushPromises();
};


beforeEach(() => {
  pinia = createTestPinia();
  store = useGeographicZoneStore();
  store.element = { id: 4, name: 'Zona Nord', constraints: [] };
  window.innerWidth = 1280;
  vi.clearAllMocks();
});


describe('ConstraintPopUp', () => {
  it('intitola il popup sulla zona aperta', () => {
    const wrapper = mountComponent(ConstraintPopUp, { pinia });

    expect(wrapper.text()).toContain('Vincoli associati');
    expect(wrapper.text()).toContain('Area: Zona Nord');
  });

  it('apre il form dal piu', async () => {
    const wrapper = mountComponent(ConstraintPopUp, { pinia });

    expect(wrapper.findComponent(ConstraintPopUpForm).exists()).toBe(false);

    await wrapper.find('.mdi-plus').trigger('click');

    expect(wrapper.findComponent(ConstraintPopUpForm).exists()).toBe(true);
  });

  it('mostra la tabella solo con almeno un vincolo', () => {
    expect(mountComponent(ConstraintPopUp, { pinia }).findComponent(ConstraintPopUpTable).exists()).toBe(false);

    store.element.constraints = [{ id: 1, day_of_week: 0, max_orders: 5 }];

    expect(mountComponent(ConstraintPopUp, { pinia }).findComponent(ConstraintPopUpTable).exists()).toBe(true);
  });
});


describe('ConstraintPopUpForm', () => {
  it('non invia nulla senza giorno e massimo ordini', async () => {
    const createEntity = vi.spyOn(store, 'createEntity');
    const wrapper = mountComponent(ConstraintPopUpForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(createEntity).not.toHaveBeenCalled();
  });

  it('accetta il lunedi, che vale zero', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const wrapper = mountComponent(ConstraintPopUpForm, { pinia });

    await fillForm(wrapper, { day: 0 });

    expect(createEntity).toHaveBeenCalledWith(
      { day_of_week: 0, max_orders: 5 },
      'constraint',
      expect.any(Function)
    );
  });

  it('manda il massimo ordini come numero', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const wrapper = mountComponent(ConstraintPopUpForm, { pinia });

    await fillForm(wrapper, { day: 3, maxOrders: '12' });

    expect(createEntity.mock.calls.at(-1)[0]).toEqual({ day_of_week: 3, max_orders: 12 });
  });

  it('alla risposta ok aggiorna la zona e chiude', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(ConstraintPopUpForm, { pinia });
    await fillForm(wrapper);

    createEntity.mock.calls.at(-1)[2]({ status: 'ok', entity: { id: 1, day_of_week: 0, max_orders: 5 } });

    expect(initList).toHaveBeenCalled();
    expect(store.element.constraints).toHaveLength(1);
    expect(wrapper.emitted('closeForm')).toHaveLength(1);
  });

  it('alla risposta ko non tocca la zona', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const wrapper = mountComponent(ConstraintPopUpForm, { pinia });
    await fillForm(wrapper);

    createEntity.mock.calls.at(-1)[2]({ status: 'ko' });

    expect(store.element.constraints).toEqual([]);
    expect(wrapper.emitted('closeForm')).toBeUndefined();
  });
});


describe('ConstraintPopUpTable', () => {
  beforeEach(() => {
    store.element.constraints = [
      { id: 1, day_of_week: 0, max_orders: 5 },
      { id: 2, day_of_week: 6, max_orders: 2 }
    ];
  });

  it('traduce il giorno della settimana', () => {
    const righe = mountComponent(ConstraintPopUpTable, { pinia }).findAll('tbody tr');

    expect(righe[0].text()).toContain('Lunedì');
    expect(righe[1].text()).toContain('Domenica');
  });

  it('cancella il vincolo e lo toglie dalla zona', async () => {
    const deleteEntity = vi.spyOn(store, 'deleteEntity').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(ConstraintPopUpTable, { pinia });

    await wrapper.findAll('tbody tr')[0].find('.mdi-delete').trigger('click');

    expect(deleteEntity).toHaveBeenCalledWith(
      { id: 1, day_of_week: 0, max_orders: 5 },
      'constraint',
      expect.any(Function),
      true
    );

    deleteEntity.mock.calls.at(-1)[2]();

    expect(initList).toHaveBeenCalled();
    expect(store.element.constraints.map(({ id }) => id)).toEqual([2]);
  });
});
