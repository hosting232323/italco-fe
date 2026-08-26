<template>
  <v-card
    title="Correggi Indirizzo"
    :subtitle="(element.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro') +
      ` ID ${element.operation_type == 'Order' ? element.order_id : element.collection_point_id}`"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <AddressAutocomplete
              v-model="address"
              :api-key="GOOGLE_API_KEY"
              :formatted="true"
              :custom-class="isMobile ? '' : 'mr-2'"
              label="Indirizzo"
              :rules="validation.requiredRules"
              @address-components="handleAddressComponents"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="cap"
              :class="isMobile ? '' : 'ml-2'"
              label="CAP"
              :rules="validation.capRules"
            />
          </v-col>
        </v-row>
        <div
          v-if="error"
          class="text-error mb-2"
        >
          {{ error }}
        </div>
        <FormButtons
          :loading="loading"
          submit-text="Salva"
          @cancel="emits('close-form')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import { AddressAutocomplete } from 'generic-module';
import { GOOGLE_API_KEY } from '@/utils/googleMaps';

import { ref, computed } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const { index } = defineProps({
  index: {
    type: Number,
    required: true
  }
});

const form = ref(null);
const error = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['close-form']);

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const collectionPointStore = useCollectionPointStore();
const { element: schedule } = storeToRefs(scheduleStore);
const element = computed(() => schedule.value.schedule_items.find(item => item.index === index));

const address = ref(element.value.address);
const cap = ref(element.value.cap);

const handleAddressComponents = (components) => {
  address.value = components.address;
  cap.value = components.cap;
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  error.value = null;
  scheduleStore.updateItemAddress(element.value, { address: address.value, cap: cap.value }, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status != 'ok') {
    error.value = data.message;
    return;
  }

  // Tutte le tappe che puntano alla stessa entità vanno allineate, altrimenti
  // la mappa continuerebbe a geocodificare il vecchio indirizzo.
  schedule.value.schedule_items
    .filter(item => item.operation_type === element.value.operation_type && (
      item.operation_type === 'Order'
        ? item.order_id === element.value.order_id
        : item.collection_point_id === element.value.collection_point_id
    ))
    .forEach(item => {
      item.address = address.value;
      item.cap = cap.value;
    });

  if (element.value.operation_type === 'Order') {
    element.value.version = data.order.version;
    orderStore.initList();
  } else
    collectionPointStore.initList();
  emits('close-form');
};
</script>
