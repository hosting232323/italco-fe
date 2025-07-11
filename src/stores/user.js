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
    logout() {
      this.$reset();
      useOrderStore(this.$pinia).$reset();
      useServiceStore(this.$pinia).$reset();
      useScheduleStore(this.$pinia).$reset();
      useTransportStore(this.$pinia).$reset();
      useCustomerRuleStore(this.$pinia).$reset();
      useCustomerGroupStore(this.$pinia).$reset();
      useDeliveryGroupStore(this.$pinia).$reset();
      useGeographicZoneStore(this.$pinia).$reset();
      useCollectionPointStore(this.$pinia).$reset();
      useAdministrationUserStore(this.$pinia).$reset();

      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
    }
  }
});
