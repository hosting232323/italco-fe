<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <SelectionTable
        v-model="selectedProducts"
        :ready="ready"
        :items="raeProducts"
        multiple
        return-object
        :headers="[
          { title: 'Id', value: 'id', sortable: false },
          { title: 'Progressivo', value: 'number', sortable: false },
          { title: 'Stato', value: 'status', sortable: false },
          { title: 'Ordine', value: 'order_id', sortable: false },
          { title: 'Prodotto', value: 'product', sortable: false },
          { title: 'Raggruppamento', value: 'product_group.group_code', sortable: false },
          { title: 'Destinatario', value: 'order.addressee', sortable: false },
          { title: 'Punto Vendita', value: 'user.company_name', sortable: false },
          { title: 'Data DTR', value: 'dtr_date', sortable: false },
          { title: 'Data di emissione', value: 'emission_date', sortable: false }
        ]"
        fill
      >
        <template #[`item.number`]="{ item }">
          {{ item.number || '' }}
        </template>
        <template #[`item.order_id`]="{ item }">
          {{ item.order?.id }}
          <span
            v-if="item.order?.external_id"
          >
            [{{ item.order.external_id }}]
          </span>
        </template>
        <template #[`item.product`]="{ item }">
          {{ item.product_group.name }}
          <template v-if="item.quantity > 1">
            x{{ item.quantity }}
          </template>
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip :color="orderUtils.RAE_STATUS.find(label => label.value == item.status).color">
            {{ orderUtils.RAE_STATUS.find(label => label.value == item.status).title }}
          </v-chip>
        </template>
        <template #[`item.user.company_name`]="{ item }">
          {{ item.user?.company_name || item.user?.nickname || '' }}
        </template>
        <template #actions="{ item }">
          <v-btn
            prepend-icon="mdi-recycle"
            text="Smaltimento"
            variant="text"
            @click="dialog = true"
          />
          <template v-if="item">
            <v-btn
              v-if="item.status == 'Emitted' && orderUtils.isTerminatedOrder(item.order)"
              prepend-icon="mdi-pencil"
              text="Modifica"
              variant="text"
              :loading="!!editLoading[item.id]"
              @click="editElement(item)"
            />
            <v-btn
              v-if="item.status == 'Annulled' && !item.link"
              prepend-icon="mdi-pencil"
              text="Modifica"
              variant="text"
              :loading="!!editLoading[item.id]"
              @click="editElement(item)"
            />
            <v-btn
              v-if="item.order && item.status != 'Generated'"
              prepend-icon="mdi-file-export"
              text="Esporta"
              variant="text"
              :loading="!!exportLoading[item.id]"
              @click="raeExport(item)"
            />
            <v-btn
              v-if="item.link"
              prepend-icon="mdi-file-pdf-box"
              text="PDF"
              variant="text"
              :href="http.withSessionToken(item.link)"
              target="_blank"
            />
          </template>
        </template>
      </SelectionTable>
    </template>
    <template #default>
      <DisposalForm
        v-show="dialog"
        :selected-products="selectedProducts"
        @cancel="dialog = false"
        @success="selectedProducts = []"
      />
    </template>
  </v-dialog>
</template>

<script setup>
import DisposalForm from '@/components/operator/raeDisposal/DisposalForm';
import SelectionTable from '@/components/SelectionTable';

import http from '@/utils/http';
import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import storesUtils from '@/utils/stores';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const dialog = ref(false);
const selectedProducts = ref([]);
const editLoading = reactive({});
const exportLoading = reactive({});
const emits = defineEmits(['open-dialog']);

const raeProductStore = useRaeProductStore();
const raeDisposalStore = useRaeDisposalStore();
const { element: disposal } = storeToRefs(raeDisposalStore);
const { element: rae, ready } = storeToRefs(raeProductStore);
const raeProducts = storesUtils.getStoreList(raeProductStore);

rae.value = {};
disposal.value = {};

const raeExport = (item) => {
  exportLoading[item.id] = true;
  http.downloadRequest(
    `export/rae/product/${item.id}`,
    'GET',
    {},
    () => exportLoading[item.id] = false
  );
};

const editElement = (item) => {
  editLoading[item.id] = true;

  http.makeRequest('rae/product/filter', 'POST', {
    body: { filters: [{ model: 'RaeProduct', field: 'id', value: item.id }] }
  }, function (data) {
    editLoading[item.id] = false;
    if (data.status == 'ok' && data.rae_products && data.rae_products.length > 0) {
      rae.value = data.rae_products[0];
      emits('open-dialog');
    } else
      alert(data.message || 'Ritiro non trovato, ricarica la pagina');
  });
};
</script>
