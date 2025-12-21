<template>
  <v-card title="Pianificazione Automatica">
    <v-card-text>
      <v-form
        ref="dpcForm"
        @submit.prevent="submitDpcForm"
      >
        <DateField 
          v-model="dpc"
          label="Data Richiesta dal Cliente"
          :rules="validation.requiredRules"
          :allowed-dates="days.getDateRangeArray()"
        />
        <FormButtons
          :loading="loading"
          @cancel="emits('cancel')"
        />
        <v-row>
          <v-col
            cols="4"
            v-for="(suggestion, index) in suggestions"
          >
            <v-card :color="theme.current.value.primaryColor">
              <v-card-title>
                Proposta Borderò {{ index + 1 }}
              </v-card-title>
              <v-card-text>
                <v-list style="border-radius: 5px;">
                  <v-list-item v-for="order in suggestion.orders">
                    <v-list-item-title class="no-truncate">
                      Ordine ID {{ order.id }}: {{ order.address }} ({{ order.cap }})<br>
                      Punti di ritiro: {{ Object.values(order.products).map(
                        product => `${product.collection_point.address} (${product.collection_point.cap})`
                      ).join(', ') }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import DateField from '@/components/DateField';
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';

const dpc = ref(null);
const theme = useTheme();
const dpcForm = ref(null);
const loading = ref(false);
const router = useRouter();
const suggestions = ref([]);
const emits = defineEmits(['cancel']);

const submitDpcForm = async () => {
  if (!(await dpcForm.value.validate()).valid) return;

  loading.value = true;
  http.getRequest('schedule/suggestions', {
    dpc: dpc.value
  }, function (data) {
    loading.value = false;
    suggestions.value = data.groups;
  }, 'GET', router);
};

const printOrderAddresses = (order) => {
  return [`${order.address} (${order.cap})`].concat(
    Object.values(order.products).map(
      product => `${product.collection_point.address} (${product.collection_point.cap})`
    )
  ).join(', ');
};
</script>

<style scoped>
.no-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}
</style>
