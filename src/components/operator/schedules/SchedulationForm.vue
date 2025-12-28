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
          class="mb-5"
          @cancel="emits('cancel')"
        />
      </v-form>
      <v-alert
        v-if="message"
        class="mt-5 mb-5"
      >
        {{ message }}
      </v-alert>
      <v-row>
        <v-col
          v-for="(suggestion, index) in suggestions"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card
            :color="theme.current.value.primaryColor"
            :title="`Proposta Borderò ${index + 1}`"
          >
            <template #append>
              <v-btn
                icon="mdi-open-in-new"
                variant="text"
                @click="openSchedule(suggestion)"
              />
            </template>
            <v-card-text>
              <v-list style="border-radius: 5px;">
                <p class="ml-4">
                  Punti di Ritiro:
                </p>
                <v-list-item
                  v-for="item in suggestion.filter(element => element.operation_type == 'CollectionPoint')"
                  :key="item.collection_point_id"
                >
                  <v-list-item-title class="no-truncate">
                    ID {{ item.collection_point_id }}: {{ item.address }} ({{ item.cap }})
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
                <p class="ml-4 mt-4">
                  Ordini:
                </p>
                <v-list-item
                  v-for="item in suggestion.filter(element => element.operation_type == 'Order')"
                  :key="item.order_id"
                >
                  <v-list-item-title class="no-truncate">
                    ID {{ item.order_id }}: {{ item.address }} ({{ item.cap }})
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useScheduleStore } from '@/stores/schedule';

const dpc = ref(null);
const message = ref('');
const theme = useTheme();
const dpcForm = ref(null);
const loading = ref(false);
const router = useRouter();
const suggestions = ref([]);
const scheduleStore = useScheduleStore();
const emits = defineEmits(['cancel', 'goToSheduleForm']);
const { element: schedule } = storeToRefs(scheduleStore);

const submitDpcForm = async () => {
  if (!(await dpcForm.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  http.getRequest('schedule/suggestions', {
    dpc: dpc.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok')
      suggestions.value = data.groups;
    else
      message.value = data.error;
  }, 'GET', router);
};

const openSchedule = (scheduleItems) => {
  schedule.value.date = dpc.value;
  schedule.value.schedule_items = scheduleItems;
  schedule.value.schedulation = true;
  emits('goToSheduleForm');
};
</script>

<style scoped>
.no-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}
</style>
