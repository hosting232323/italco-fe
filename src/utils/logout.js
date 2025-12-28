import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const logout = (router) => {
  useUserStore().$reset();
  useOrderStore().$reset();
  useServiceStore().$reset();
  useScheduleStore().$reset();
  useTransportStore().$reset();
  useCustomerRuleStore().$reset();
  useCustomerGroupStore().$reset();
  useGeographicZoneStore().$reset();
  useCollectionPointStore().$reset();
  useAdministrationUserStore().$reset();

  router.push('/');
};

export default {
  logout
};
