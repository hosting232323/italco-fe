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
      const orderStore = useOrderStore(this.$pinia);
      const serviceStore = useServiceStore(this.$pinia);
      const scheduleStore = useScheduleStore(this.$pinia);
      const transportStore = useTransportStore(this.$pinia);
      const customerRuleStore = useCustomerRuleStore(this.$pinia);
      const customerGroupStore = useCustomerGroupStore(this.$pinia);
      const deliveryGroupStore = useDeliveryGroupStore(this.$pinia);
      const geographicZoneStore = useGeographicZoneStore(this.$pinia);
      const collectionPointStore = useCollectionPointStore(this.$pinia);
      const administrationUserStore = useAdministrationUserStore(this.$pinia);

      this.$reset();
      orderStore.$reset();
      serviceStore.$reset();
      scheduleStore.$reset();
      transportStore.$reset();
      customerRuleStore.$reset();
      customerGroupStore.$reset();
      deliveryGroupStore.$reset();
      geographicZoneStore.$reset();
      collectionPointStore.$reset();
      administrationUserStore.$reset();

      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
    }
  }
});
