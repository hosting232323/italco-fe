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
          <OperatoreFilters v-if="role != 'Customer'" />
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
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
            >
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="filters['Order.dpc']"
                    :class="isMobile ? '' : 'mr-2'"
                    label="Data Prevista dal Cliente"
                    type="date"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="filters['Order.drc']"
                    :class="isMobile ? '' : 'ml-2 mr-2'"
                    label="Data Richiesta dal Cliente"
                    type="date"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-row no-gutters>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="dateFilter.start_date"
                    :class="isMobile ? '' : 'mr-2 ml-2'"
                    :rules="intervallRules('end_date')"
                    label="Inizio Intervallo Data Consegna"
                    type="date"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="dateFilter.end_date"
                    :class="isMobile ? '' : 'ml-2'"
                    :rules="intervallRules('start_date')"
                    label="Fine Intervallo Data Consegna"
                    type="date"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <FormButtons
            :loading="false"
            @cancel="panel = null"
          />
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-row
    v-if="role == 'Admin' && !panel && filters['ItalcoUser.id'] && dateFilter.start_date && dateFilter.end_date"
    no-gutters
  >
    <v-col
      cols="8"
      style="font-size: smaller;"
    >
      Punto Vendita: {{ filters['ItalcoUser.id'] }}<br>
      Data di Inizio Intervallo: {{ dateFilter.start_date }}<br>
      Data di Fine Intervallo: {{ dateFilter.end_date }}
    </v-col>
    <v-col cols="4">
      <v-btn
        style="float: right;"
        text="Esporta"
        :color="theme.current.value.primaryColor"
        :loading="loading"
        @click="exportInvoice"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import OperatoreFilters from '@/components/operator/Filters';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import orderUtils from '@/utils/order';
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
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const collectionPointStore = useCollectionPointStore();
const { role } = storeToRefs(userStore);
const { filters, dateFilter, ready } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const filterOrder = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  orderStore.initList(router);
  panel.value = null;
};

const intervallRules = (otherKey) => {
  return [
    (value) => {
      if (value && !dateFilter.value[otherKey]) return 'Usare entrambe le date per filtrare';
      return true;
    }
  ];
};

const exportInvoice = async () => {
  loading.value = true;

  http.postRequest('export/invoice', {
    date_filter: dateFilter.value,
    filters: orderUtils.formatFilters(filters.value)
  }, function (data) {
    loading.value = false;
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordini_${dateFilter.value.start_date}_${dateFilter.value.end_date}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, 'POST', router, true);
};
</script>
