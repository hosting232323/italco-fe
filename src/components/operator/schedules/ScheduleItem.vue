<template>
  <v-row
    no-gutters
    class="mt-2"
  >
    <v-col cols="1">
      <div
        class="drag-handle"
        style="cursor: grab;"
      >
        <v-icon>mdi-drag</v-icon>
      </div>
    </v-col>
    <v-col :cols="editingAddressId === (localElement.order_id || localElement.collection_point_id) ? 10 : 4">
      <p>
        {{ localElement.index + 1 }}: 
        {{ localElement.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }}
        ID {{ localElement.operation_type == 'Order' ? localElement.order_id : localElement.collection_point_id }}
      </p>
      <div style="font-size: smaller; padding-right: 5px;">
        <template v-if="editingAddressId !== (localElement.order_id || localElement.collection_point_id)">
          {{ localElement.address }}, {{ localElement.cap }}
          <v-icon
            v-if="notFoundAddresses.includes(localElement.address)"
            color="warning"
            size="16"
            class="ml-1"
          >
            mdi-alert-circle
          </v-icon>
          <v-icon
            v-if="notFoundAddresses.includes(localElement.address)"
            size="16"
            class="ml-1"
            style="cursor:pointer"
            @click="startEditing"
          >
            mdi-pencil
          </v-icon>
        </template>
        <template v-else>
          <div class="d-flex justify-center align-center">
            <div
              class="d-flex flex-column"
              style="width: 100%;"
            >
              {{ previousAddress }}
              <GooglePlacesAutocomplete
                v-model="localElement.address"
                label="Modifica indirizzo"
                :rules="validation.requiredRules"
                custom-class="mt-2"
                @address-components="updateAddress"
              />
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              style="margin-bottom: 22px;"
              @click="editingAddressId = null"
            />
          </div>
        </template>
      </div>
    </v-col>
    <v-col   
      v-if="editingAddressId !== (localElement.order_id || localElement.collection_point_id)"
      cols="6"
    >
      <div :class="['d-flex', 'align-center', isMobile ? 'flex-column' : '']">
        <v-text-field 
          v-model="localElement.start_time_slot" 
          label="Time Slot Start"
          type="time"
          :rules="validation.requiredRules" 
          dense
          hide-details
          :style="isMobile ? { margin: '15px 0', width: '' }: { width: '200px', marginRight: '15px' }"
        />
        <v-text-field 
          v-model="localElement.end_time_slot" 
          label="Time Slot End"
          type="time"
          :rules="validation.futureTime(localElement.start_time_slot)" 
          dense
          hide-details
          :style="isMobile ? { width: '' }: { width: '200px' }"
        />
      </div>
    </v-col>
    <v-col cols="1">
      <v-btn
        v-if="localElement.operation_type === 'Order' &&
          schedule.schedule_items.filter(item => item.operation_type == 'Order').length > 1"
        variant="text"
        icon="mdi-delete"
        :color="theme.current.value.primaryColor"
        @click="removeOrder"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';

import { ref, reactive, watch } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  notFoundAddresses: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:element']);

const theme = useTheme();
const router = useRouter();
const previousAddress = ref('');
const editingAddressId = ref(null);
const isMobile = mobile.setupMobileUtils();

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);

const localElement = reactive({ ...props.element });

if (!localElement.id) {
  localElement.start_time_slot = '08:00';
  localElement.end_time_slot = '09:00';
}

watch(() => props.element, (val) => Object.assign(localElement, val), { deep: true });
watch(localElement, (val) => emit('update:element', { ...val }), { deep: true });

const removeOrder = () => {
  const remainingItems = schedule.value.schedule_items.filter(
    item => !(item.operation_type === 'Order' && item.order_id === localElement.order_id));

  const usedCollectionPointIds = new Set(remainingItems.filter(item => item.operation_type === 'Order')
    .flatMap(item => Object.values(item.products).map(product => product.collection_point.id)));

  const removedOrderCollectionPointIds = new Set(Object.values(localElement.products).map(product => product.collection_point.id));

  schedule.value.schedule_items = remainingItems.filter(item =>
    item.operation_type !== 'CollectionPoint' ||
    usedCollectionPointIds.has(item.collection_point_id) ||
    !removedOrderCollectionPointIds.has(item.collection_point_id)
  );
};

const updateAddress = (value) => {
  localElement.cap = value.cap;
  localElement.address = value.address;
  if (localElement.operation_type == 'CollectionPoint')
    http.postRequest(`collection-point/${localElement.collection_point_id}`, {
      address: value.address,
      cap: value.cap
    }, callback, 'PUT', router);
  else
    http.postRequest(`order/${localElement.order_id}`, {
      address: value.address,
      cap: value.cap
    }, callback, 'PUT', router);
};

const callback = () => {
  orderStore.initList(router);
  editingAddressId.value = null;
};

const startEditing = () => {
  previousAddress.value = localElement.address;
  editingAddressId.value = localElement.order_id || localElement.collection_point_id;
  localElement.address = '';
};
</script>
