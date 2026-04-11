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
    <v-col :cols="editingAddressId === (element.order_id || element.collection_point_id) ? 10 : 4">
      <p>
        {{ element.index + 1 }}: 
        {{ element.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }}
        ID {{ element.operation_type == 'Order' ? element.order_id : element.collection_point_id }}
      </p>
      <div style="font-size: smaller; padding-right: 5px;">
        <template v-if="editingAddressId !== (element.order_id || element.collection_point_id)">
          {{ element.address }}, {{ element.cap }}
          <template v-if="notFoundAddresses.includes(element.address)">
            <v-icon
              color="warning"
              size="16"
              class="ml-1"
              title="Indirizzo non identificato"
            >
              mdi-alert-circle
            </v-icon>
            <v-icon
              size="16"
              class="ml-1"
              style="cursor:pointer"
              @click="startEditing(element)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </template>
        <template v-else>
          <div class="d-flex justify-center align-center">
            <div
              class="d-flex flex-column"
              style="width: 100%;"
            >
              {{ previousAddress }}
              <GooglePlacesAutocomplete
                v-model="element.address"
                label="Modifica indirizzo"
                :rules="validation.requiredRules"
                custom-class="mt-2"
                @address-components="(data) => updateAddress(data, element)"
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
      v-if="editingAddressId !== (element.order_id || element.collection_point_id)"
      cols="6"
    >
      <div :class="['d-flex', 'align-center', isMobile ? 'flex-column' : '']">
        <v-text-field 
          v-model="element.start_time_slot" 
          label="Time Slot Start"
          type="time"
          :rules="validation.requiredRules" 
          dense
          hide-details
          :style="isMobile ? { margin: '15px 0', width: '' }: { width: '200px', marginRight: '15px' }"
        />
        <v-text-field 
          v-model="element.end_time_slot" 
          label="Time Slot End"
          type="time"
          :rules="validation.futureTime(element.start_time_slot)" 
          dense
          hide-details
          :style="isMobile ? { width: '' }: { width: '200px' }"
        />
      </div>
    </v-col>
    <v-col cols="1">
      <v-btn
        v-if="element.operation_type === 'Order' &&
          schedule.schedule_items.filter(item => item.operation_type == 'Order').length > 1"
        variant="text"
        icon="mdi-delete"
        :color="theme.current.value.primaryColor"
        @click="removeOrder(element)"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

const { index, notFoundAddresses } = defineProps({
  index: {
    type: Number,
    required: true
  },
  notFoundAddresses: {
    type: Array,
    required: true
  }
});

const theme = useTheme();
const router = useRouter();
const previousAddress = ref('');
const editingAddressId = ref(null);
const isMobile = mobile.setupMobileUtils();

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);
const element = schedule.value.schedule_items.find(item => item.index === index);

if (!element.id) {
  element.start_time_slot = '08:00';
  element.end_time_slot = '09:00';
}

const removeOrder = (order) => {
  const remainingItems = schedule.value.schedule_items.filter(
    item => !(item.operation_type === 'Order' && item.order_id === order.order_id));

  const usedCollectionPointIds = new Set(remainingItems.filter(item => item.operation_type === 'Order')
    .flatMap(item => Object.values(item.products).map(product => product.collection_point.id)));

  const removedOrderCollectionPointIds = new Set(Object.values(order.products).map(product => product.collection_point.id));

  schedule.value.schedule_items = remainingItems.filter(item =>
    item.operation_type !== 'CollectionPoint' ||
    usedCollectionPointIds.has(item.collection_point_id) ||
    !removedOrderCollectionPointIds.has(item.collection_point_id)
  );
};

const updateAddress = (value, element) => {
  element.cap = value.cap;
  element.address = value.address;
  if(element.operation_type == 'CollectionPoint')
    http.postRequest(`collection-point/${element.collection_point_id}`,{ 
      address: value.address,
      cap: value.cap
    }, callback, 'PUT', router);
  else
    http.postRequest(`order/${element.order_id}`,{ 
      address: value.address,
      cap: value.cap
    }, callback, 'PUT', router);
};

const callback = () => {
  orderStore.initList(router);
  editingAddressId.value = null;
};

const startEditing = (element) => {
  previousAddress.value = element.address;
  editingAddressId.value = element.order_id || element.collection_point_id;
  element.address = '';
};
</script>
