import { beforeEach, describe, expect, it, vi } from 'vitest';

import CustomerGroupTable from '@/components/administration/sellingPoints/CustomerGroupTable.vue';
import GeographicZoneTable from '@/components/administration/sellingPoints/GeographicZoneTable.vue';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';

import { createTestPinia, mountComponent } from '../../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

let pinia;

const rows = (wrapper) => wrapper.findAll('tbody tr');

const mountTable = (component, store, items) => {
  store.ready = true;
  store.list = items;
  return mountComponent(component, { pinia });
};


beforeEach(() => {
  pinia = createTestPinia();
  vi.clearAllMocks();
});


describe('CustomerGroupTable', () => {
  const gruppi = [
    { id: 1, name: 'Gruppo Bari', users: [{ nickname: 'mario' }, { nickname: 'anna' }] },
    { id: 2, name: 'Gruppo Nord', users: [] }
  ];

  it('mostra lo scheletro finche la lista non e pronta', () => {
    const store = useCustomerGroupStore();
    store.ready = false;

    expect(mountComponent(CustomerGroupTable, { pinia }).find('.v-skeleton-loader').exists()).toBe(true);
  });

  it('elenca i clienti di ogni gruppo', () => {
    const wrapper = mountTable(CustomerGroupTable, useCustomerGroupStore(), gruppi);

    expect(rows(wrapper)[0].text()).toContain('mario, anna');
  });

  it('chiede di aprire il popup del gruppo', async () => {
    const wrapper = mountTable(CustomerGroupTable, useCustomerGroupStore(), gruppi);

    await rows(wrapper)[0].find('.mdi-account-group').trigger('click');

    expect(wrapper.emitted('openPopUp')[0]).toEqual([gruppi[0], 'customerGroup']);
  });

  it('cancella il gruppo e ricarica', async () => {
    const store = useCustomerGroupStore();
    const deleteElement = vi.spyOn(store, 'deleteElement').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountTable(CustomerGroupTable, store, gruppi);

    await rows(wrapper)[0].find('.mdi-delete').trigger('click');
    deleteElement.mock.calls.at(-1)[1]();

    expect(deleteElement.mock.calls.at(-1)[0]).toEqual(gruppi[0]);
    expect(initList).toHaveBeenCalled();
  });
});


describe('GeographicZoneTable', () => {
  const zone = [
    {
      id: 1,
      name: 'Zona Nord',
      codes: [{ code: '70020', type: true }, { code: '70100', type: false }],
      constraints: [{ day_of_week: 0, max_orders: 5 }]
    },
    { id: 2, name: 'Zona Sud', codes: [], constraints: [] }
  ];

  it('descrive cap aggiunti e rimossi', () => {
    const wrapper = mountTable(GeographicZoneTable, useGeographicZoneStore(), zone);

    const testo = rows(wrapper)[0].text();
    expect(testo).toContain('70020');
    expect(testo).toContain('Aggiunto');
    expect(testo).toContain('Rimosso');
  });

  it('descrive i vincoli con il nome del giorno', () => {
    const wrapper = mountTable(GeographicZoneTable, useGeographicZoneStore(), zone);

    expect(rows(wrapper)[0].text()).toContain('Lunedì');
  });

  it('dice esplicitamente quando non c-e nulla', () => {
    const wrapper = mountTable(GeographicZoneTable, useGeographicZoneStore(), zone);

    const testo = rows(wrapper)[1].text();
    expect(testo).toContain('Nessun CAP speciale');
    expect(testo).toContain('Nessun vincolo');
  });

  it('chiede di aprire i due popup della zona', async () => {
    const wrapper = mountTable(GeographicZoneTable, useGeographicZoneStore(), zone);

    await rows(wrapper)[0].find('.mdi-map-marker-outline').trigger('click');
    await rows(wrapper)[0].find('.mdi-store-clock').trigger('click');

    expect(wrapper.emitted('openPopUp')[0]).toEqual([zone[0], 'geographicCode']);
    expect(wrapper.emitted('openPopUp')[1]).toEqual([zone[0], 'constraint']);
  });

  it('cancella la zona e ricarica', async () => {
    const store = useGeographicZoneStore();
    const deleteElement = vi.spyOn(store, 'deleteElement').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountTable(GeographicZoneTable, store, zone);

    await rows(wrapper)[0].find('.mdi-delete').trigger('click');
    deleteElement.mock.calls.at(-1)[1]();

    expect(initList).toHaveBeenCalled();
  });
});
