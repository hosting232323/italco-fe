<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="raeProductGroups"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Codice CER', value: 'cer_code', sortable: false },
      { title: 'Codice Raggruppamento', value: 'group_code', sortable: false },
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
import storesUtils from '@/utils/stores';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';

const theme = useTheme();
const deleteLoading = reactive({});

const raeProductGroupStore = useRaeProductGroupStore();
const { element: raeProductGroup, activeForm, ready } = storeToRefs(raeProductGroupStore);
const raeProductGroups = storesUtils.getStoreList(raeProductGroupStore);

const openForm = (item) => {
  raeProductGroup.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  raeProductGroupStore.deleteElement(item, function() {
    raeProductGroupStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
