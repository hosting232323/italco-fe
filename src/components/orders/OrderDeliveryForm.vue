<template>
  <v-select
    v-model="order.status"
    :disabled="order.status == 'New'"
    label="Stato"
    :items="orderUtils.LABELS.filter(label => label.value != 'New')"
  />
  <v-textarea
    v-model="order.motivation"
    label="Motivazione"
    rows="3"
  />
  <v-file-input
    v-model="order.photos"
    multiple
    accept="image/*"
    label="Foto"
  />
  <v-row no-gutters>
    <v-col
      cols="6"
      :class="isMobile ? 'd-flex flex-column' : 'd-flex justify-center align-center'"
    >
      <v-radio-group v-model="order.delay">
        <label class="mr-2">In ritardo</label>
        <v-radio
          label="Sì"
          :value="true"
        />
        <v-radio
          label="No"
          :value="false"
        />
      </v-radio-group>
      <div
        v-if="order.delay"
        :style="isMobile ? { width: '100%' } : { width: '50%', height: '100%' }"
        :class="isMobile ? 'd-flex flex-column' : 'd-flex justify-center align-center'"
      >
        <v-text-field
          v-model="order.start_time_slot"
          label="Time Slot Start"
          type="time"
          :rules="validation.requiredRules"
          dense
          hide-details
          :style="isMobile ? { margin: '15px 0', width: '100%' } : { maxWidth: '115px', marginRight: '15px' }"
        />
        <v-text-field
          v-model="order.end_time_slot"
          label="Time Slot End"
          type="time"
          :rules="validation.futureTime(order.start_time_slot)"
          dense
          hide-details
          :style="isMobile ? { width: '100%' } : { maxWidth: '115px' }"
        />
      </div>
    </v-col>
    <v-col cols="6">
      <v-radio-group v-model="order.anomaly">
        <label class="mr-2">Con Anomalia</label>
        <v-radio
          label="Sì"
          :value="true"
        />
        <v-radio
          label="No"
          :value="false"
        />
      </v-radio-group>
    </v-col>
  </v-row>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import orderUtils from '@/utils/order';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const { element: order } = storeToRefs(orderStore);
</script>
