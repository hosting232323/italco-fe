import { defineStore } from 'pinia';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    userId: 0
  }),
  actions: {
    logout(router) {
      this.$reset();
      useOrderStore().$reset();
      useServiceStore().$reset();
      useScheduleStore().$reset();
      useTransportStore().$reset();
      useCustomerRuleStore().$reset();
      useCustomerGroupStore().$reset();
      useDeliveryGroupStore().$reset();
      useGeographicZoneStore().$reset();
      useCollectionPointStore().$reset();
      useAdministrationUserStore().$reset();
      router.push('/');
    }
  }
});
