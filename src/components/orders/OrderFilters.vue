<template>
  <v-expansion-panels
    v-model="panel"
    class="mt-10 mb-5"
  >
    <v-expansion-panel :color="theme.current.value.primaryColor">
      <v-expansion-panel-title>
        <h3>Filtri</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="mt-5">
        <v-form
          ref="form"
          @submit.prevent="filterOrder"
        >
          <OperatorFilters v-if="role != 'Customer'" />
          <v-row no-gutters>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Order.id']"
                :class="isMobile ? '' : 'mr-2'"
                label="ID Ordine"
                type="number"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Order.addressee']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                label="Destinatario"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                v-model="filters['CollectionPoint.id']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                label="Punto di Ritiro"
                :items="collectionPoints"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                v-model="filters['Service.id']"
                :class="isMobile ? '' : 'ml-2'"
                label="Servizio"
                :items="services"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
          </v-row>
          <DateFilters
            element="Order"
            :filter-types="storesUtils.ORDER_DATE_FILTER_TYPES"
          />
          <FormButtons
            :loading="false"
            @cancel="panel = null"
          />
        </v-form>
        <v-btn
          v-if="role == 'Admin' && !panel && filters['CustomerUser.id'] && filters['Order.dpc']
            && filters['Order.dpc'][0] && filters['Order.dpc'][1]"
          class="mt-2"
          block
          text="Esporta Fatturazione"
          prepend-icon="mdi-file-pdf-box"
          :color="theme.current.value.primaryColor"
          :loading="loading"
          @click="exportInvoice"
        />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import DateFilters from '@/components/DateFilters';
import OperatorFilters from '@/components/operator/OperatorFilters';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const form = ref(null);
const panel = ref(null);
const theme = useTheme();
const router = useRouter();
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();

const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const collectionPointStore = useCollectionPointStore();
const { role } = storeToRefs(userStore);
const { filters, ready } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const filterOrder = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  orderStore.initList(router);
  panel.value = null;
};

const exportInvoice = async () => {
  loading.value = true;

  http.postRequest('export/invoice', {
    filters: storesUtils.formatFilters(
      filters.value,
      storesUtils.ORDER_DATE_FILTER_TYPES,
      'Order'
    )
  }, function (data) {
    loading.value = false;
    panel.value = null;
    if (data.status == 'ko')
      alert(data.error);
    else {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ordini_${filters.value['Order.dpc'][0]}_${filters.value['Order.dpc'][1]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, 'POST', router);
};
</script>
