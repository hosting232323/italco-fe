import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CarrierForm from '@/components/administration/raeCarrier/CarrierForm.vue';
import CarrierTable from '@/components/administration/raeCarrier/CarrierTable.vue';
import CollectionCenterForm from '@/components/administration/raeCollectionCenter/CollectionCenterForm.vue';
import CollectionCenterTable from '@/components/administration/raeCollectionCenter/CollectionCenterTable.vue';
import CollectionPointForm from '@/components/customers/collectionPoints/CollectionPointForm.vue';
import CollectionPointTable from '@/components/customers/collectionPoints/CollectionPointTable.vue';
import CustomerGroupForm from '@/components/administration/sellingPoints/CustomerGroupForm.vue';
import GeographicZoneForm from '@/components/administration/sellingPoints/GeographicZoneForm.vue';
import RaeProductGroupForm from '@/components/administration/raeProductGroups/RaeProductGroupForm.vue';
import RaeProductGroupTable from '@/components/administration/raeProductGroups/RaeProductGroupTable.vue';
import ServiceForm from '@/components/administration/services/ServiceForm.vue';
import ServiceTable from '@/components/administration/services/ServiceTable.vue';
import TransportForm from '@/components/administration/transports/TransportForm.vue';
import TransportTable from '@/components/administration/transports/TransportTable.vue';
import UserForm from '@/components/administration/users/UserForm.vue';

import { useAdministrationUserStore } from '@/stores/administrationUser';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useRaeCarrierStore } from '@/stores/raeCarrier';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';
import { useServiceStore } from '@/stores/service';
import { useTransportStore } from '@/stores/transport';

import { flushPromises } from '@vue/test-utils';
import http from '@/utils/http';

import { createTestPinia, mountComponent } from '../../helpers/mount';
import { describeCrudForm, describeCrudTable } from '../../helpers/crudComponents';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const RAE_COMPANY = {
  company_name: 'Italco Srl',
  address: 'Via Roma 1, Bari',
  fiscal_code: 'TLCSRL80A01A662X',
  vat_number: '12345678901',
  authorization_code: 'AUT-123',
  authorization_date: '2026-01-01'
};

const tables = [
  {
    name: 'TransportTable',
    component: TransportTable,
    useStore: useTransportStore,
    items: [{ id: 1, name: 'Furgone', plate: 'AA111BB', cap: '70020' }]
  },
  {
    name: 'CarrierTable',
    component: CarrierTable,
    useStore: useRaeCarrierStore,
    items: [{ id: 1, ...RAE_COMPANY }]
  },
  {
    name: 'CollectionCenterTable',
    component: CollectionCenterTable,
    useStore: useRaeCollectionCenterStore,
    items: [{ id: 1, ...RAE_COMPANY }]
  },
  {
    name: 'RaeProductGroupTable',
    component: RaeProductGroupTable,
    useStore: useRaeProductGroupStore,
    items: [{ id: 1, name: 'Grandi bianchi', cer_code: 200136, group_code: 'R1' }]
  },
  {
    name: 'ServiceTable',
    component: ServiceTable,
    useStore: useServiceStore,
    items: [{ id: 1, name: 'Consegna', type: 'Delivery', duration: 30 }]
  },
  {
    name: 'CollectionPointTable',
    component: CollectionPointTable,
    useStore: useCollectionPointStore,
    items: [{ id: 1, name: 'Magazzino', address: 'Via Bari 1', cap: '70020' }]
  }
];

const forms = [
  {
    name: 'TransportForm',
    component: TransportForm,
    useStore: useTransportStore,
    validElement: { name: 'Furgone', plate: 'AA111BB' },
    createTitle: 'Crea Veicolo',
    updateTitle: 'Modifica Veicolo 7'
  },
  {
    name: 'CarrierForm',
    component: CarrierForm,
    useStore: useRaeCarrierStore,
    validElement: RAE_COMPANY,
    createTitle: 'Crea Trasportatore',
    updateTitle: 'Modifica Trasportatore 7'
  },
  {
    name: 'CollectionCenterForm',
    component: CollectionCenterForm,
    useStore: useRaeCollectionCenterStore,
    validElement: RAE_COMPANY,
    createTitle: 'Crea Centro di Raccolta',
    updateTitle: 'Modifica Centro di Raccolta 7'
  },
  {
    name: 'RaeProductGroupForm',
    component: RaeProductGroupForm,
    useStore: useRaeProductGroupStore,
    validElement: { name: 'Grandi bianchi', cer_code: 200136, group_code: 'R1' },
    createTitle: 'Crea Raggruppamento Raee',
    updateTitle: 'Modifica Raggruppamento Raee 7'
  },
  {
    name: 'ServiceForm',
    component: ServiceForm,
    useStore: useServiceStore,
    validElement: { name: 'Consegna', type: 'Delivery' },
    createTitle: 'Crea Servizio',
    updateTitle: 'Modifica Servizio 7'
  },
  {
    name: 'CollectionPointForm',
    component: CollectionPointForm,
    useStore: useCollectionPointStore,
    validElement: {
      name: 'Magazzino',
      address: 'Via Bari 1',
      cap: '70020',
      opening_time: '08:00',
      closing_time: '18:00'
    },
    createTitle: 'Crea Punto di Ritiro',
    updateTitle: 'Modifica Punto di Ritiro 7'
  },
  {
    name: 'CustomerGroupForm',
    component: CustomerGroupForm,
    useStore: useCustomerGroupStore,
    validElement: { name: 'Gruppo Bari' },
    createTitle: 'Crea',
    update: false
  },
  {
    name: 'GeographicZoneForm',
    component: GeographicZoneForm,
    useStore: useGeographicZoneStore,
    validElement: { name: 'Zona Nord' },
    createTitle: 'Crea',
    update: false
  },
  {
    name: 'UserForm',
    component: UserForm,
    useStore: useAdministrationUserStore,
    validElement: { email: 'mario@example.com', password: 'Password1', role: 'Customer' },
    createTitle: 'Crea',
    update: false
  }
];


describe.each(tables)('$name', (config) => {
  beforeEach(() => vi.clearAllMocks());

  describeCrudTable(config);
});


describe.each(forms)('$name', (config) => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1280;
  });

  afterEach(() => vi.useRealTimers());

  describeCrudForm(config);
});


describe('UserForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('mostra il messaggio di errore del backend quando il email esiste gia', async () => {
    // Il mock deve rispondere 'ko' solo alla POST di creazione: intercettare
    // anche la GET della lista (fatta da getStoreList al mount) svuoterebbe
    // store.list e farebbe esplodere il template su `users.length`.
    http.makeRequest.mockImplementation((url, method, options, func) => {
      if (method === 'POST') func({ status: 'ko', message: 'Email già in uso' });
    });
    const pinia = createTestPinia();
    const store = useAdministrationUserStore();
    store.activeForm = true;
    store.ready = true;
    store.element = { email: 'mario@example.com', password: 'Password1', role: 'Customer' };
    const wrapper = mountComponent(UserForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.text()).toContain('Email già in uso');
  });
});
