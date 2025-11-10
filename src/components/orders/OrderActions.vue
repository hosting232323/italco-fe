<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
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
            variant="text"
            icon="mdi-file-export"
            :loading="loadingExport"
            :color="theme.current.value.primaryColor"
            @click="exportPdf(item)"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-truck-delivery"
            variant="text"
            :color="theme.current.value.primaryColor"
            v-bind="activatorProps"
            @click="order = item"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-link-variant"
            variant="text"
            :color="theme.current.value.primaryColor"
            title="Copia link ordine"
            @click="copyOrderLink(item.id)"
          />
        </v-col>
      </v-row>
      <v-btn
        v-if="item.status == 'To Reschedule' && role != 'Customer'"
        icon="mdi-content-copy"
        variant="text"
        :color="theme.current.value.primaryColor"
        title="Clona ordine"
        @click="copyOrder(item)"
      />
    </template>
    <template #default>
      <OrderDeliverySummary :order="order" />
    </template>
  </v-dialog>
</template>

<script setup>
import OrderDeliverySummary from '@/components/orders/OrderDeliverySummary';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { encodeId } from '@/utils/hashids';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const { item } = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const order = ref({});
const theme = useTheme();
const router = useRouter();
const loadingExport = ref(false);
const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const { element: updatedOrder, activeForm } = storeToRefs(orderStore);

const openForm = (item) => {
  updatedOrder.value = item;
  updatedOrder.value.user_id = updatedOrder.value.user.id;
  activeForm.value = true;
};

const exportPdf = async (item) => {
  loadingExport.value = true;

  http.getRequest(`export/order/${item.id}`, {}, function (data) {
    loadingExport.value = false;
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordine_${item.id}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, 'GET', router, true);
};

const copyOrderLink = (id) => {
  const url = `${window.location.origin}/order/${encodeId(id)}`;
  navigator.clipboard.writeText(url).then(() => {
    alert('Link ordine copiato negli appunti:\n' + url);
  }).catch(() => {
    alert('Errore nel copiare il link');
  });
};

const copyOrder = (selectedOrder) => {
  const { user, id, ...rest } = selectedOrder;
  updatedOrder.value = {
    user,
    user_id: user.id,
    cloned_order_id: id,
    ...Object.fromEntries(
      Object.entries(rest).filter(([key]) =>
        ![
          'schedule_id', 'status', 'anomaly', 'delay', 'schedule_index', 'start_time_slot', 'end_time_slot', 'id', 'price'
        ].includes(key)
      )
    )
  };
  activeForm.value = true;
};
</script>
