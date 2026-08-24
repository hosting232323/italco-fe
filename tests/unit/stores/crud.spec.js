import { afterEach, beforeEach, describe, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useRaeCarrierStore } from '@/stores/raeCarrier';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';
import { useRaeDisposalStore } from '@/stores/raeDisposal';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';
import { useScheduleItemStore } from '@/stores/scheduleItem';
import { useScheduleStore } from '@/stores/schedule';
import { useServiceStore } from '@/stores/service';
import { useTransportStore } from '@/stores/transport';
import { useUserStore } from '@/stores/user';

import { describeCrudStore } from '../../helpers/stores';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const READ_ONLY_KEYS = ['created_at', 'updated_at'];

const stores = [
  {
    name: 'transport',
    useStore: useTransportStore,
    endpoint: 'transport',
    listKey: 'transports',
    excludedKeys: READ_ONLY_KEYS
  },
  {
    name: 'collectionPoint',
    useStore: useCollectionPointStore,
    endpoint: 'collection-point',
    listKey: 'collection_points',
    excludedKeys: [...READ_ONLY_KEYS, 'users']
  },
  {
    name: 'service',
    useStore: useServiceStore,
    endpoint: 'service',
    listKey: 'services',
    excludedKeys: [...READ_ONLY_KEYS, 'users']
  },
  {
    name: 'customerGroup',
    useStore: useCustomerGroupStore,
    endpoint: 'customer-group',
    listKey: 'customer_groups',
    update: false
  },
  {
    name: 'customerRule',
    useStore: useCustomerRuleStore,
    endpoint: 'customer-rule',
    listKey: 'customer_rules',
    update: false,
    remove: false
  },
  {
    name: 'geographicZone',
    useStore: useGeographicZoneStore,
    endpoint: 'geographic-zone',
    listKey: 'geographic_zones',
    update: false
  },
  {
    name: 'raeCarrier',
    useStore: useRaeCarrierStore,
    endpoint: 'rae/carrier',
    listKey: 'rae_carriers',
    excludedKeys: [...READ_ONLY_KEYS, 'users']
  },
  {
    name: 'raeCollectionCenter',
    useStore: useRaeCollectionCenterStore,
    endpoint: 'rae/collection-center',
    listKey: 'rae_collection_centers',
    excludedKeys: [...READ_ONLY_KEYS, 'users']
  },
  {
    name: 'raeProductGroup',
    useStore: useRaeProductGroupStore,
    endpoint: 'rae/product-group',
    listKey: 'rae_product_groups',
    excludedKeys: READ_ONLY_KEYS
  },
  {
    name: 'raeDisposal',
    useStore: useRaeDisposalStore,
    endpoint: 'rae/disposal',
    listKey: 'rae_disposals',
    update: false,
    remove: false
  },
  {
    name: 'raeProduct',
    useStore: useRaeProductStore,
    endpoint: 'rae/product',
    listKey: 'rae_products',
    listEndpoint: 'rae/product/filter',
    listMethod: 'POST',
    listBody: { filters: [] },
    create: false,
    update: false
  },
  {
    name: 'schedule',
    useStore: useScheduleStore,
    endpoint: 'schedule',
    listKey: 'schedules',
    listEndpoint: 'schedule/filter',
    listMethod: 'POST',
    listBody: { filters: [] },
    excludedKeys: ['created_at', 'updated_at', 'transport', 'orders', 'schedulation']
  },
  {
    name: 'scheduleItem',
    useStore: useScheduleItemStore,
    endpoint: 'schedule',
    listKey: 'schedule_items',
    listEndpoint: 'schedule/delivery',
    create: false,
    update: false,
    remove: false
  }
];


describe.each(stores)('$name store', (config) => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useUserStore().company = { id: 1, name: 'Test', rae: true };
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => vi.useRealTimers());

  describeCrudStore(config);
});
