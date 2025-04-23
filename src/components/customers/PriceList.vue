<template>
  <v-list>
    <v-row no-gutters>
      <v-col cols="12" md="6" v-for="service in services">
        <v-list-item
          :title="service.name"
          :value="service.id"
          :subtitle="service.description"
        >
          <template v-slot:append>
            {{ getPrice(service) }} €
          </template>
        </v-list-item>
      </v-col>
    </v-row>
  </v-list>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useServiceStore } from '@/stores/service';

const userStore = useUserStore();
const serviceStore = useServiceStore();
const { userId } = storeToRefs(userStore);
const { list: services } = storeToRefs(serviceStore);

const getPrice = (service) => {
  return service.users.find(user => user.user_id == userId.value).price;
};
</script>