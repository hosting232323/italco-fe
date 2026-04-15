<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="raeProducts"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Progressivo', value: 'rae_number', sortable: false },
      { title: 'Stato', value: 'status', sortable: false },
      { title: 'Prodotto', value: 'product', sortable: false },
      { title: 'Ordine', value: 'order', sortable: false },
      { title: 'Punto Vendita', value: 'user.nickname', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
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
    <template #[`item.order`]="{ item }">
      <template v-if="item.order">
        [ {{ item.order.id }} ]
        {{ item.order.addressee }}
      </template>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        v-if="item.order"
        icon="mdi-file-export"
        variant="text"
        :loading="!!exportLoading[item.id]"
        :color="theme.current.value.primaryColor"
        @click="raeExport(item)"
      />
      <v-btn
        v-else
        icon="mdi-delete"
        variant="text"
        :loading="!!deleteLoading[item.id]"
        :color="theme.current.value.primaryColor"
        @click="deleteItem(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useRaeProductStore } from '@/stores/raeProduct';

const theme = useTheme();
const router = useRouter();
const deleteLoading = reactive({});
const exportLoading = reactive({});

const raeProductStore = useRaeProductStore();
const { ready } = storeToRefs(raeProductStore);
const raeProducts = storesUtils.getStoreList(raeProductStore, router);

const raeExport = (item) => {
  exportLoading[item.id] = true;

  http.getRequest(`export/rae/${item.order.id}`, {}, function (data) {
    exportLoading[item.id] = false;
    if (data.status == 'ko')
      alert(data.error);
    else {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raee_${item.order.id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, 'GET', router);
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;

  raeProductStore.deleteElement(item, router, function() {
    raeProductStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>
