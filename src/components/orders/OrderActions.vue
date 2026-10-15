<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <div class="d-flex flex-wrap align-center">
        <v-btn
          prepend-icon="mdi-pencil"
          text="Modifica"
          title="Modifica ordine"
          variant="text"
          :color="theme.current.value.primaryColor"
          @click="openForm(item)"
        />
        <v-btn
          variant="text"
          prepend-icon="mdi-file-export"
          text="PDF ordine"
          title="Esporta l'ordine in PDF"
          :loading="loadingExport"
          :color="theme.current.value.primaryColor"
          @click="exportPdf(item)"
        />
        <v-btn
          prepend-icon="mdi-truck-delivery"
          text="Consegna"
          title="Riepilogo della consegna"
          variant="text"
          :color="theme.current.value.primaryColor"
          v-bind="activatorProps"
          @click="openPopUp(item, 'delivery')"
        />
        <v-btn
          prepend-icon="mdi-link-variant"
          text="Link ordine"
          title="Copia link di tracking dell'ordine"
          variant="text"
          :color="theme.current.value.primaryColor"
          @click="copyOrderLink(item.id)"
        />
        <template v-if="role != 'Customer'">
          <v-btn
            prepend-icon="mdi-account"
            text="Punto vendita"
            title="Cambia punto vendita"
            variant="text"
            :color="theme.current.value.primaryColor"
            v-bind="activatorProps"
            @click="openPopUp(item, 'customer')"
          />
          <v-btn
            v-if="item.status == 'To Reschedule' &&
              Object.values(item.products).every(
                product => !product.rae_product || !product.rae_product.status.includes(['Emitted', 'Generated'])
              )"
            prepend-icon="mdi-content-copy"
            text="Clona"
            title="Clona ordine"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="copyOrder(item)"
          />
          <v-btn
            v-if="raeEnabled && Object.values(item.products).some(product => product.rae_product) && !['Acquired', 'Booked'].includes(item.status)"
            prepend-icon="mdi-human-dolly"
            text="RAEE"
            title="Esportazione RAEE"
            variant="text"
            :loading="raeLoading"
            :color="theme.current.value.primaryColor"
            @click="raeExport(item)"
          />
          <v-btn
            v-if="item.external_link"
            prepend-icon="mdi-exit-to-app"
            text="Euronics"
            title="Chiudi ordine in piattaforma Euronics"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openExternalLink(item.external_link)"
          />
          <v-btn
            v-if="role == 'Admin' && ['Acquired', 'Booked'].includes(item.status)"
            prepend-icon="mdi-swap-horizontal"
            text="Sposta company"
            title="Sposta in un'altra company"
            variant="text"
            :color="theme.current.value.primaryColor"
            v-bind="activatorProps"
            @click="openPopUp(item, 'company')"
          />
          <v-btn
            v-if="role == 'Admin'"
            prepend-icon="mdi-delete"
            text="Elimina"
            title="Elimina ordine"
            :loading="loadingDelete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteOrder(item)"
          />
        </template>
      </div>
    </template>
    <template #default="{ isActive }">
      <OrderDeliverySummary
        v-if="popUpType == 'delivery'"
        :order="order"
      />
      <ChangeOrderUser
        v-else-if="popUpType == 'customer'"
        :order="order"
        @cancel="isActive.value = false"
      />
      <MoveOrderCompany
        v-else-if="popUpType == 'company'"
        :order="order"
        @cancel="isActive.value = false"
      />
    </template>
  </v-dialog>
</template>

<script setup>
import ChangeOrderUser from '@/components/orders/ChangeOrderUser';
import MoveOrderCompany from '@/components/orders/MoveOrderCompany';
import OrderDeliverySummary from '@/components/orders/OrderDeliverySummary';

import { ref, computed } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import rae from '@/utils/rae';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useRaeProductStore } from '@/stores/raeProduct';

const { item } = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const order = ref({});
const theme = useTheme();
const popUpType = ref('');
const raeLoading = ref(false);
const loadingExport = ref(false);
const loadingDelete = ref(false);

const userStore = useUserStore();
const orderStore = useOrderStore();
// effectiveRole: il super admin in una company agisce con i permessi di un admin.
const { effectiveRole: role, company } = storeToRefs(userStore);
const raeProductStore = useRaeProductStore();

// Un'attività può spegnere il modulo dopo averlo usato: gli ordini con ritiro
// restano, ma l'esportazione RAEE non è più un endpoint raggiungibile.
const raeEnabled = computed(() => !!company.value?.rae);
const { element: updatedOrder, activeForm, ready } = storeToRefs(orderStore);

const openExternalLink = (link) => {
  window.open(link, '_blank');
};

const openForm = (item) => {
  updatedOrder.value = item;
  updatedOrder.value.user_id = updatedOrder.value.user.id;
  orderStore.addressValid = true;
  activeForm.value = true;
};

const openPopUp = (item, type) => {
  order.value = item;
  popUpType.value = type;
};

const exportPdf = (item) => {
  loadingExport.value = true;

  http.downloadRequest(
    `export/order/${item.id}`,
    'GET',
    {},
    () => loadingExport.value = false
  );
};

const copyOrderLink = (id) => {
  http.makeRequest(`order/${id}/tracking-link`, 'POST', {}, (data) => {
    if (data.status !== 'ok' || !data.token) {
      alert('Errore nella creazione del link ordine');
      return;
    }
    const url = `${window.location.origin}/order/track#${encodeURIComponent(data.token)}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link ordine copiato negli appunti:\n' + url);
    }).catch(() => {
      alert('Errore nel copiare il link');
    });
  });
};

const copyOrder = (selectedOrder) => {
  const { user, id, products, ...rest } = selectedOrder;
  const filteredProducts = rae.filterCloneProducts(products);

  updatedOrder.value = {
    user,
    user_id: user.id,
    booking_date: null,
    cloned_order_id: id,
    products: filteredProducts,
    ...Object.fromEntries(
      Object.entries(rest).filter(([key]) =>
        ![
          'booking_date', 'schedule_id', 'status', 'anomaly', 'delay', 'schedule_index', 'start_time_slot', 'end_time_slot', 'id', 'price'
        ].includes(key)
      )
    )
  };
  orderStore.addressValid = false; // clone: l'indirizzo copiato va riselezionato da Nominatim
  activeForm.value = true;
};

const deleteOrder = (item) => {
  loadingDelete.value = true;
  http.makeRequest(`order/${item.id}`, 'DELETE', {}, function (data) {
    loadingDelete.value = false;
    if (data.status == 'ok') {
      ready.value = false;
      orderStore.initList();
      raeProductStore.initList();
    } else
      alert(data.message);
  });
};

const raeExport = (item) => {
  raeLoading.value = true;

  http.downloadRequest(
    `export/rae/${item.id}`,
    'GET',
    {},
    () => raeLoading.value = false
  );
};
</script>
