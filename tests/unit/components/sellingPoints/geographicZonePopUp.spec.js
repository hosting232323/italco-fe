import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import GeographicCodePopUp from '@/components/administration/sellingPoints/GeographicCodePopUp.vue';
import GeographicCodePopUpForm from '@/components/administration/sellingPoints/GeographicCodePopUpForm.vue';
import GeographicCodePopUpTable from '@/components/administration/sellingPoints/GeographicCodePopUpTable.vue';
import { useGeographicZoneStore } from '@/stores/geographicZone';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;
let store;

const zone = (codes = []) => ({ id: 4, name: 'Zona Nord', codes });

const fillForm = async (wrapper, { code = '70020', type = 'Aggiungi' } = {}) => {
  await wrapper.find('input[type="number"]').setValue(code);
  await wrapper.findComponent({ name: 'VSelect' }).vm.$emit('update:modelValue', type);
  await wrapper.find('form').trigger('submit');
  await flushPromises();
};


beforeEach(() => {
  pinia = createTestPinia();
  store = useGeographicZoneStore();
  store.element = zone();
  window.innerWidth = 1280;
  vi.clearAllMocks();
});


describe('GeographicCodePopUp', () => {
  it('intitola il popup sulla zona aperta', () => {
    const wrapper = mountComponent(GeographicCodePopUp, { pinia });

    expect(wrapper.text()).toContain('CAP aggiunti o rimossi');
    expect(wrapper.text()).toContain('Area: Zona Nord');
  });

  it('tiene chiuso il form finche non si preme il piu', async () => {
    const wrapper = mountComponent(GeographicCodePopUp, { pinia });

    expect(wrapper.findComponent(GeographicCodePopUpForm).exists()).toBe(false);

    await wrapper.find('.mdi-plus').trigger('click');

    expect(wrapper.findComponent(GeographicCodePopUpForm).exists()).toBe(true);
  });

  it('richiude il form quando questo lo chiede', async () => {
    const wrapper = mountComponent(GeographicCodePopUp, { pinia });
    await wrapper.find('.mdi-plus').trigger('click');

    await wrapper.findComponent(GeographicCodePopUpForm).vm.$emit('closeForm');

    expect(wrapper.findComponent(GeographicCodePopUpForm).exists()).toBe(false);
  });

  it('mostra la tabella solo quando ci sono cap', () => {
    expect(mountComponent(GeographicCodePopUp, { pinia }).findComponent(GeographicCodePopUpTable).exists()).toBe(false);

    store.element = zone([{ id: 1, code: '70020', type: true }]);

    expect(mountComponent(GeographicCodePopUp, { pinia }).findComponent(GeographicCodePopUpTable).exists()).toBe(true);
  });
});


describe('GeographicCodePopUpForm', () => {
  it('non invia nulla senza cap e tipo', async () => {
    const createEntity = vi.spyOn(store, 'createEntity');
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(createEntity).not.toHaveBeenCalled();
  });

  it('rifiuta un cap che non ha cinque cifre', async () => {
    const createEntity = vi.spyOn(store, 'createEntity');
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });

    await fillForm(wrapper, { code: '700' });

    expect(createEntity).not.toHaveBeenCalled();
  });

  it('aggiunge il cap alla zona', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });

    await fillForm(wrapper);

    expect(createEntity).toHaveBeenCalledWith(
      { code: '70020', type: true },
      'code',
      expect.any(Function)
    );
  });

  it('marca come sottrazione il cap escluso', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });

    await fillForm(wrapper, { type: 'Sottrai' });

    expect(createEntity.mock.calls.at(-1)[0].type).toBe(false);
  });

  it('alla risposta ok aggiorna la zona e chiude', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });
    await fillForm(wrapper);

    createEntity.mock.calls.at(-1)[2]({ status: 'ok', entity: { id: 1, code: '70020', type: true } });

    expect(initList).toHaveBeenCalled();
    expect(store.element.codes).toEqual([{ id: 1, code: '70020', type: true }]);
    expect(wrapper.emitted('closeForm')).toHaveLength(1);
  });

  it('alla risposta ko non tocca la zona', async () => {
    const createEntity = vi.spyOn(store, 'createEntity').mockImplementation(() => {});
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });
    await fillForm(wrapper);

    createEntity.mock.calls.at(-1)[2]({ status: 'ko', message: 'errore' });

    expect(store.element.codes).toEqual([]);
    expect(wrapper.emitted('closeForm')).toBeUndefined();
  });

  it('il pulsante di annullamento chiude il form', async () => {
    const wrapper = mountComponent(GeographicCodePopUpForm, { pinia });

    await wrapper.findComponent({ name: 'FormButtons' }).vm.$emit('cancel');

    expect(wrapper.emitted('closeForm')).toHaveLength(1);
  });
});


describe('GeographicCodePopUpTable', () => {
  beforeEach(() => {
    store.element = zone([
      { id: 1, code: '70020', type: true },
      { id: 2, code: '70100', type: false }
    ]);
  });

  it('mostra una riga per cap', () => {
    const wrapper = mountComponent(GeographicCodePopUpTable, { pinia });

    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
  });

  it('traduce il tipo in aggiunto o rimosso', () => {
    const righe = mountComponent(GeographicCodePopUpTable, { pinia }).findAll('tbody tr');

    expect(righe[0].text()).toContain('Aggiunto');
    expect(righe[1].text()).toContain('Rimosso');
  });

  it('cancella il cap e lo toglie dalla zona', async () => {
    const deleteEntity = vi.spyOn(store, 'deleteEntity').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountComponent(GeographicCodePopUpTable, { pinia });

    await wrapper.findAll('tbody tr')[0].find('.mdi-delete').trigger('click');

    expect(deleteEntity).toHaveBeenCalledWith(
      { id: 1, code: '70020', type: true },
      'code',
      expect.any(Function),
      true
    );

    deleteEntity.mock.calls.at(-1)[2]();

    expect(initList).toHaveBeenCalled();
    expect(store.element.codes.map(({ id }) => id)).toEqual([2]);
  });
});
