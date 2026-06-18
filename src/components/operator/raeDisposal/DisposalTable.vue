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
      { title: 'Codice', value: 'code', sortable: false },
      { title: 'Trasportatore', value: 'carrier.company_name', sortable: false },
      { title: 'Centro di raccolta', value: 'collection_center.company_name', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.actions`]="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            v-if="item.document_fir"
            icon="mdi-file-pdf-box"
            variant="text"
            :color="theme.current.value.primaryColor"
            :href="item.document_fir"
            target="_blank"
          />
          <v-btn
            v-else
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="editElement(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-tooltip text="Elenco cronologico ritiri RAEE">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-clipboard-list-outline"
                variant="text"
                :color="theme.current.value.primaryColor"
                :loading="exportingPickupList[item.id]"
                @click="exportAllegato(item, 1)"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="6">
          <v-tooltip text="Riepilogo quantità per raggruppamento">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-chart-bar"
                variant="text"
                :color="theme.current.value.primaryColor"
                :loading="exportingGroupSummary[item.id]"
                @click="exportAllegato(item, 2)"
              />
            </template>
          </v-tooltip>
        </v-col>
        <v-col cols="6">
          <v-tooltip text="Ritiri suddivisi per punto vendita">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-store-outline"
                variant="text"
                :color="theme.current.value.primaryColor"
                :loading="exportingBySalePoint[item.id]"
                @click="exportAllegato(item, 3)"
              />
            </template>
          </v-tooltip>
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

const editElement = (item) => {
  disposal.value = { ...item };
  emits('open-dialog');
};

const exportingPickupList = reactive({});
const exportingGroupSummary = reactive({});
const exportingBySalePoint = reactive({});

const exportRoutes = {
  1: { path: 'pickup-list',   loading: exportingPickupList,   filename: 'elenco_ritiri' },
  2: { path: 'group-summary', loading: exportingGroupSummary, filename: 'riepilogo_raggruppamenti' },
  3: { path: 'by-sale-point', loading: exportingBySalePoint,  filename: 'per_punto_vendita' },
};

const exportAllegato = (item, allegato) => {
  const { path, loading, filename } = exportRoutes[allegato];
  loading[item.id] = true;
  http.getRequest(`export/disposal/${item.id}/${path}`, {}, (data) => {
    loading[item.id] = false;
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `smaltimento_${item.id}_${filename}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, 'GET', router);
};
</script>
