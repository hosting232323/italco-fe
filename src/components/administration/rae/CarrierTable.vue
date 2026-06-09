<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="raeCarriers"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'company_name', sortable: false },
      { title: 'Indirizzo', value: 'address', sortable: false },
      { title: 'Codice Fiscale', value: 'fiscal_code', sortable: false },
      { title: 'Partita IVA', value: 'vat_number', sortable: false },
      { title: 'Codice di autorizzazione', value: 'authorization_code', sortable: false },
      { title: 'Data di autorizzazione', value: 'authorization_date', sortable: false },
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
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useRaeCarrierStore } from '@/stores/raeCarrier';

const { activatorProps } = defineProps({
  activatorProps: {
    type: Object,
    required: true
  }
});

const theme = useTheme();
const router = useRouter();
const deleteLoading = reactive({});

const raeCarrierStore = useRaeCarrierStore();
const { element: raeCarrier, activeForm, ready } = storeToRefs(raeCarrierStore);

const raeCarriers = storesUtils.getStoreList(raeCarrierStore, router);

const openForm = (item) => {
  raeCarrier.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  raeCarrierStore.deleteElement(item, router, function() {
    raeCarrierStore.initList(router);
    deleteLoading[item.id] = false;
  });
};

const formatTime = (value) => {
  if (!value) return '';
  return `${value} min`;
};
</script>
