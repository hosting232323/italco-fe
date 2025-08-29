<template>
  <v-data-table
    :items="services"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title:'Tipo', value: 'type' },
      { title: 'Descrizione', value: 'description' },
      { title: 'Max Giornaieri', value: 'max_services' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.type="{ item }">
      {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm(item)"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-label"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openPopUp(item)"
            v-bind="activatorProps"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :loading="deleteLoading[item.id]"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const router = useRouter();
const serviceStore = useServiceStore();
const props = defineProps(['activatorProps']);
const { element: service, activeForm } = storeToRefs(serviceStore);
const services = storesUtils.getStoreList(serviceStore, router);
const deleteLoading = reactive({});

const openForm = (item) => {
  service.value = item;
  activeForm.value = true;
};

const openPopUp = (item) => {
  service.value = item;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  serviceStore.deleteElement(item, router, function() {
    serviceStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
