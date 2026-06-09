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
            v-if="item.document_ldr"
            icon="mdi-file-pdf-box"
            variant="text"
            :color="theme.current.value.primaryColor"
            :href="item.document_ldr"
            target="_blank"
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
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const theme = useTheme();
const router = useRouter();
const deleteLoading = reactive({});

const raeDisposalStore = useRaeDisposalStore();
const { ready } = storeToRefs(raeDisposalStore);
const raeDisposals = storesUtils.getStoreList(raeDisposalStore, router);

const deleteItem = (item) => {
  if (!confirm('Sei sicuro di voler eliminare questo smaltimento?')) return;
  deleteLoading[item.id] = true;
  raeDisposalStore.deleteElement(item, router, function() {
    raeDisposalStore.initList(router);
    deleteLoading[item.id] = false;
  });
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString();
};
</script>
