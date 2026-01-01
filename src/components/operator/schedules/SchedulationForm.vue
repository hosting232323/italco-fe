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
                  v-for="item in suggestion.schedule_items.filter(element => element.operation_type == 'CollectionPoint')"
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
                  v-for="item in suggestion.schedule_items.filter(element => element.operation_type == 'Order')"
                  :key="item.order_id"
                >
                  <v-list-item-title class="no-truncate">
                    ID {{ item.order_id }}: {{ item.address }} ({{ item.cap }})
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
                <p class="ml-4 mt-4">
                  Utenti Delivery:
                </p>
                <draggable
                  v-model="suggestion.delivery_users"
                  :group="{ name: 'users', pull: false, put: true }"
                  item-key="id"
                  class="draggable-area ml-3 mr-3"
                >
                  <template #item="{ element }">
                    <v-chip
                      :text="element.nickname"
                      closable
                      class="mr-2 mt-2"
                      @click:close="suggestion.delivery_users = []"
                    />
                  </template>
                </draggable>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <template v-if="deliveryUsers.length > 0">
        <h2 class="mt-4">
          Utenti disponibili
        </h2>
        <draggable
          v-model="deliveryUsers"
          :group="{ name: 'users', pull: 'clone', put: false }"
          :clone="cloneUser"
          item-key="id"
        >
          <template #item="{ element }">
            <v-chip
              :text="element.nickname"
              class="ma-1"
              draggable
            />
          </template>
        </draggable>
      </template>
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
import draggable from 'vuedraggable';
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
const deliveryUsers = ref([]);
const scheduleStore = useScheduleStore();
const emits = defineEmits(['cancel', 'goToSheduleForm']);
const { element: schedule } = storeToRefs(scheduleStore);

const cloneUser = (user) => {
  return { ...user };
};

const submitDpcForm = async () => {
  if (!(await dpcForm.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  http.getRequest('schedule/suggestions', {
    dpc: dpc.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      suggestions.value = data.groups;
      deliveryUsers.value = data.delivery_users;
    } else
      message.value = data.error;
  }, 'GET', router);
};

const openSchedule = (suggestion) => {
  schedule.value.date = dpc.value;
  schedule.value.schedulation = true;
  schedule.value.users = suggestion.delivery_users;
  schedule.value.schedule_items = suggestion.schedule_items;
  emits('goToSheduleForm');
};
</script>

<style scoped>
.no-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

.draggable-area {
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
}

.v-chip {
  cursor: grab;
}

.v-chip:active {
  cursor: grabbing;
}
</style>
