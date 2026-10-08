<template>
  <v-data-table
    :items="service.users"
    :headers="[
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Prezzo', value: 'price', sortable: false },
      { title: 'Codice', value: 'code', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.actions`]="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm(item)"
          />
        </v-col>
        <v-col cols="6">
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
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const deleteLoading = reactive({});

const serviceStore = useServiceStore();
const { element: service, innerElement: serviceUser, activePopUpForm } = storeToRefs(serviceStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  serviceStore.deleteServiceUserRelationships(item, function() {
    service.value.users = service.value.users.filter(user => user.id !== item.id);
    serviceStore.initList();
    deleteLoading[item.id] = false;
  });
};

const openForm = (item) => {
  serviceUser.value = item;
  activePopUpForm.value = true;
};
</script>
