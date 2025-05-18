<template>
  <v-expansion-panels class="mt-10 mb-5" v-model="panel">
    <v-expansion-panel :color="theme.current.value.primaryColor">
      <v-expansion-panel-title>
        <h3>Filtri</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="mt-5">
        <v-form ref="form" @submit.prevent="filterOrder">
          <v-autocomplete
            v-if="role != 'Customer'"
            v-model="filters['ItalcoUser.id']"
            label="Punto Vendita"
            :items="users.filter(user => user.role == 'Customer')"
            item-title="email"
            item-value="id"
            clearable
          />
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-autocomplete
                :class="isMobile ? '' : 'mr-2'"
                v-model="filters['CollectionPoint.id']"
                label="Punto di Ritiro"
                :items="collectionPoints"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :class="isMobile ? '' : 'ml-2'"
                v-model="filters['Service.id']"
                label="Servizio"
                :items="services"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-text-field
                    :class="isMobile ? '' : 'mr-2'"
                    v-model="filters['Order.dpc']"
                    label="Data Promessa al Cliente"
                    type="date"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :class="isMobile ? '' : 'ml-2 mr-2'"
                    v-model="filters['Order.drc']"
                    label="Data Richiesta dal Cliente"
                    type="date"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="12" md="6">
                  <v-text-field
                    :class="isMobile ? '' : 'mr-2 ml-2'"
                    v-model="dateFilter.start_date"
                    :rules="intervallRules('end_date')"
                    label="Inizio Intervallo Data Consegna"
                    type="date"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :class="isMobile ? '' : 'ml-2'"
                    v-model="dateFilter.end_date"
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
  no-gutters>
    <v-col cols="8" style="font-size: smaller;">
      Punto Vendita: {{ filters['ItalcoUser.id'] }}<br>
      Data di Inizio Intervallo: {{ dateFilter.start_date }}<br>
      Data di Fine Intervallo: {{ dateFilter.end_date }}
    </v-col>
    <v-col cols="4">
      <v-btn
        style="float: right;"
        text="Esporta"
        :color="theme.current.value.primaryColor"
        @click="exportInvoice"
        :loading="loading"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

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
import { useCollectionPointStore } from '@/stores/collectionPoints';
import { useAdministrationUserStore } from '@/stores/administrationUser';

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
const administrationUserStore = useAdministrationUserStore();
const { role } = storeToRefs(userStore);
const { filters, dateFilter } = storeToRefs(orderStore);
const services = storesUtils.getStoresList(serviceStore, router);
const users = storesUtils.getStoresList(administrationUserStore, router);
const collectionPoints = storesUtils.getStoresList(collectionPointStore, router);

const filterOrder = async () => {
  if (!(await form.value.validate()).valid) return;

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
  }, 'POST', router, true)
};
</script>
