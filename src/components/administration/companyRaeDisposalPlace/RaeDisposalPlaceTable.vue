<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-2"
  />
  <v-data-table
    v-else
    :items="places"
    :headers="[
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Estremi iscrizione Albo Gestori Ambientali', value: 'rae_registration', sortable: false },
      { title: 'Luogo di raggruppamento RAEE', value: 'rae_grouping_place', sortable: false },
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
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const theme = useTheme();
const deleteLoading = reactive({});

const store = useCompanyRaeDisposalPlaceStore();
const { list: places, element: place, activeForm, ready } = storeToRefs(store);

const openForm = (item) => {
  place.value = { ...item };
  activeForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  store.deleteElement(item, () => {
    store.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
