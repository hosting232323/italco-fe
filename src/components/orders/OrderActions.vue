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
            @click="openPopUp(item)"
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
        @click="copyOrder(item.id)"
      />
    </template>
    <template #default>
      <v-card :title="`Situazione delivery ordine ${order.id}`">
        <v-card-text>
          Note Operatore: {{ order.operator_note }}<br>
          Note Punto Vendita: {{ order.customer_note }}<br>
          <v-skeleton-loader
            v-if="loadingPhoto"
            type="image"
          />
          <div v-else>
            <div v-if="motivations && motivations.length">
              <p class="text-h6">
                Motivazioni
              </p>
              <v-list dense>
                <v-list-item
                  v-for="motivation in motivations"
                  :key="motivation.id"
                  :title="motivation.text"
                >
                  <v-list-item-subtitle>
                    Stato: {{ orderUtils.LABELS.find(label => label.value == motivation.status).title }} |
                    <span v-if="motivation.delay">Ritardo |</span>
                    <span v-if="motivation.anomaly">Anomalia |</span>
                    Creata: {{ motivation.created_at }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
            <div v-else>
              Nessuna motivazione presente.
            </div>
            <div v-if="photos && photos.length">
              <div
                v-for="photo in photos"
                :key="photo"
              >
                <v-skeleton-loader 
                  v-if="!imageLoading[photo]" 
                  type="image" 
                />
                <v-img
                  :src="`${http.hostname}order/photo/${photo}`"
                  max-width="1500"
                  max-height="1000"
                  class="mt-4"
                  @load="imageLoading[photo] = true"
                />
              </div>
            </div>
            <div v-else>
              Nessuna immagine disponibile.
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
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
const photos = ref([]);
const theme = useTheme();
const router = useRouter();
const motivations = ref([]);
const loadingPhoto = ref(false);
const loadingExport = ref(false);
const userStore = useUserStore();
const imageLoading = reactive({});
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const orders = storesUtils.getStoreList(orderStore, router);
const { element: updatedOrder, activeForm } = storeToRefs(orderStore);

const openPopUp = (item) => {
  order.value = item;
  loadingPhoto.value = true;

  http.getRequest(`order/delivery-details/${item.id}`, {}, function (data) {
    photos.value = data.photos;
    motivations.value = data.motivations;
    loadingPhoto.value = false;
  }, 'GET', router);
};

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

const copyOrder = (id) => {
  const selectedOrder = orders.value.find(order => order.id == id);
  const clonedOrder = { ...selectedOrder };

  clonedOrder.user_id = selectedOrder.user.id;
  ['schedule_id', 'status', 'anomaly', 'delay', 'schedule_index', 'start_time_slot', 'end_time_slot', 'id', 'price']
    .forEach(key => delete clonedOrder[key]);

  updatedOrder.value = clonedOrder;
  updatedOrder.value.user_id = updatedOrder.value.user.id;
  activeForm.value = true;
};
</script>
