<template>
  <v-list style="background-color: transparent;">
    <v-row no-gutters>
      <v-col cols="12" md="6" v-for="service in services">
        <v-list-item
          :value="service.id"
          :style="{ '--item-bg-color': theme.current.value.primaryColor }"
          @click="clickItem(service.id)"
        >
          <v-list-item-title class="contact-text">
            {{ service.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ service.description }}
          </v-list-item-subtitle>
          <template v-slot:append>
            <b class="ml-2">{{ getPrice(service) }} €</b>
          </template>
        </v-list-item>
      </v-col>    
    </v-row>
  </v-list>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const { userId } = storeToRefs(userStore);
const { element: order } = storeToRefs(orderStore);
const { list: services } = storeToRefs(serviceStore);

const getPrice = (service) => {
  return service.users.find(user => user.user_id == userId.value).price;
};

const clickItem = (serviceId) => {
  order.value.service_id = serviceId;
}
</script>

<style scoped>
.v-list-item {
  background-color: var(--item-bg-color);
  margin: 2px;
  color: white;
}
.contact-text {
  white-space: normal;
}
.v-list-item-subtitle {
  display: -webkit-box;
  display: box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>