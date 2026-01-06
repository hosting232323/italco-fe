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
                      @click:close="removeDeliveryUser(suggestion, element)"
                    />
                  </template>
                </draggable>
                <v-divider class="mt-4 mb-4" />
                <p class="ml-4 mt-4">
                  Veicoli:
                </p>
                <draggable
                  v-model="suggestion.transports"
                  :group="{ name: 'transports', pull: false, put: true }"
                  item-key="id"
                  class="draggable-area ml-3 mr-3"
                >
                  <template #item="{ element }">
                    <v-chip
                      :text="element.name"
                      closable
                      class="mr-2 mt-2"
                      @click:close="removeTransport(suggestion, element)"
                    />
                  </template>
                </draggable>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <template v-if="availableDeliveryUsers.length > 0">
        <h2 class="mt-4">
          Utenti disponibili
        </h2>
        <draggable
          :list="availableDeliveryUsers"
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
      <template v-if="availableTransports.length > 0">
        <h2 class="mt-4">
          Veicoli disponibili
        </h2>
        <draggable
          :list="availableTransports"
          :group="{ name: 'transports', pull: 'clone', put: false }"
          :clone="cloneTransport"
          item-key="id"
        >
          <template #item="{ element }">
            <v-chip
              :text="element.name"
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

import { ref, computed } from 'vue';
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
const transports = ref([]);
const suggestions = ref([]);
const deliveryUsers = ref([]);
const scheduleStore = useScheduleStore();
const emits = defineEmits(['cancel', 'goToSheduleForm']);
const { element: schedule } = storeToRefs(scheduleStore);

const cloneUser = (user) => {
  return { ...user };
};
const cloneTransport = (transport) => {
  return { ...transport };
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
      suggestions.value = data.groups.map(group => ({
        ...group,
        transports: []
      }));
      transports.value = data.transports;
      deliveryUsers.value = data.delivery_users;
    } else
      message.value = data.error;
  }, 'GET', router);
};

const openSchedule = (suggestion) => {
  schedule.value.date = dpc.value;
  schedule.value.schedulation = true;
  schedule.value.users = suggestion.delivery_users;
  schedule.value.transports = suggestion.transports;
  schedule.value.schedule_items = suggestion.schedule_items;
  emits('goToSheduleForm');
};

const assignedUserIds = computed(() => {
  return suggestions.value
    .flatMap(s => s.delivery_users)
    .map(u => u.id);
});

const availableDeliveryUsers = computed(() => {
  return deliveryUsers.value.filter(
    user => !assignedUserIds.value.includes(user.id)
  );
});

const assignedTransportIds = computed(() => {
  return suggestions.value
    .flatMap(s => s.transports)
    .map(t => t.id);
});

const availableTransports = computed(() =>
  transports.value.filter(
    t => !assignedTransportIds.value.includes(t.id)
  )
);

const removeDeliveryUser = (suggestion, user) => {
  suggestion.delivery_users = suggestion.delivery_users.filter(
    u => u.id !== user.id
  );
};

const removeTransport = (suggestion, transport) => {
  suggestion.transports = suggestion.transports.filter(
    t => t.id !== transport.id
  );
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
