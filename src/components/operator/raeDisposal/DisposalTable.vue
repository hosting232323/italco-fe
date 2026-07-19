<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="raeDisposals"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Data', value: 'date', sortable: false },
      { title: 'Peso', value: 'weight', sortable: false },
      { title: 'Codice', value: 'code', sortable: false },
      { title: 'Raggruppamenti', key: 'group_quantities', sortable: false },
      { title: 'Trasportatore', value: 'carrier.company_name', sortable: false },
      { title: 'Centro di raccolta', value: 'collection_center.company_name', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.group_quantities`]="{ item }">
      {{ formatGroupQuantities(item.group_quantities) }}
    </template>
    <template #[`item.actions`]="{ item }">
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            title="Modifica smaltimento"
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="editElement(item)"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            title="FIR Prima Copia"
            icon="mdi-file-pdf-box"
            variant="text"
            :color="theme.current.value.primaryColor"
            :href="http.withSessionToken(item.first_copy_document_fir)"
            :disabled="!item.first_copy_document_fir"
            target="_blank"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            title="FIR Quarta Copia"
            icon="mdi-file-pdf-box"
            variant="text"
            :color="theme.current.value.primaryColor"
            :href="http.withSessionToken(item.fourth_copy_document_fir)"
            :disabled="!item.fourth_copy_document_fir"
            target="_blank"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            title="Allegato 1"
            icon="mdi-clipboard-list-outline"
            variant="text"
            :color="theme.current.value.primaryColor"
            :loading="exportingAttachment1[item.id]"
            @click="exportAllegato(item, 1)"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            title="Allegato 2"
            icon="mdi-chart-bar"
            variant="text"
            :color="theme.current.value.primaryColor"
            :loading="exportingAttachment2[item.id]"
            @click="exportAllegato(item, 2)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import http from '@/utils/http';

import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const theme = useTheme();
const router = useRouter();
const emits = defineEmits(['open-dialog']);

const raeDisposalStore = useRaeDisposalStore();
const { ready, element: disposal } = storeToRefs(raeDisposalStore);
const raeDisposals = storesUtils.getStoreList(raeDisposalStore, router);

const formatGroupQuantities = (groupQuantities = {}) => {
  const values = Object.entries(groupQuantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([groupCode, quantity]) => `${groupCode}: ${quantity}`);

  return values.join(', ') || '-';
};

const editElement = (item) => {
  disposal.value = { ...item };
  emits('open-dialog');
};

const exportingAttachment1 = reactive({});
const exportingAttachment2 = reactive({});

const exportRoutes = {
  1: { path: 'attached-1', loading: exportingAttachment1 },
  2: { path: 'attached-2', loading: exportingAttachment2 },
};

const exportAllegato = (item, allegato) => {
  const { path, loading } = exportRoutes[allegato];
  loading[item.id] = true;
  http.downloadRequest(
    `export/disposal/${item.id}/${path}`,
    {},
    'GET',
    router,
    () => loading[item.id] = false
  );
};
</script>
