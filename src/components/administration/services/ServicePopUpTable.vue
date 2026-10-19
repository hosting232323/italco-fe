<template>
  <SelectionTable
    :items="service.users"
    :headers="[
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Prezzo', value: 'price', sortable: false },
      { title: 'Codice', value: 'code', sortable: false }
    ]"
  >
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
      />
      <v-btn
        prepend-icon="mdi-delete"
        text="Elimina"
        variant="text"
        :loading="deleteLoading[item.id]"
        @click="deleteItem(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

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
