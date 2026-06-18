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
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
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
</script>
