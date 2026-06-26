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
          <v-tooltip text="Allegato A">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-clipboard-list-outline"
                variant="text"
                :color="theme.current.value.primaryColor"
                :loading="exportingAttachedA[item.id]"
                @click="exportAllegato(item, 1)"
              />
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="6">
          <v-tooltip text="Allegato B">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-chart-bar"
                variant="text"
                :color="theme.current.value.primaryColor"
                :loading="exportingAttachedB[item.id]"
                @click="exportAllegato(item, 2)"
              />
            </template>
          </v-tooltip>
        </v-col>
        <v-col cols="6">
          <v-tooltip text="Schedari">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-store-outline"
                variant="text"
                :color="theme.current.value.primaryColor"
                :loading="exportingCardIndex[item.id]"
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

const exportingAttachedA = reactive({});
const exportingAttachedB = reactive({});
const exportingCardIndex = reactive({});

const exportRoutes = {
  1: { path: 'attached-a', loading: exportingAttachedA },
  2: { path: 'attached-a', loading: exportingAttachedB },
  3: { path: 'card-index', loading: exportingCardIndex },
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
