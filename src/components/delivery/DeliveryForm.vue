<template>
  <v-card :title="`ID Ordine: ${order.id} - Nuovo stato: ${orderUtils.LABELS.find(label => label.value == order.status)?.title}`">
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-textarea
          v-if="order.status === 'Not Delivered' || order.delay || order.anomaly"
          v-model="order.motivation"
          label="Motivazione"
          rows="3"
          :rules="validation.requiredRules"
        />
        <v-file-input
          v-if="['Delivered', 'Not Delivered'].includes(order.status) || order.delay || order.anomaly"
          v-model="order.photos"
          multiple
          accept="image/*"
          label="Foto"
          :rules="(order.status === 'Delivered' || order.anomaly) ? validation.arrayRules : []"
        />
        <template
          v-if="order.status == 'To Reschedule'"
          v-for="product in Object.keys(order.products)"
        >
          <b>{{ product }}</b>:<br>
          <i style="font-size: small;">
            {{ order.products[product].services.join(', ') }}
          </i>
          <v-select
            v-model="order.products[product].new_collection_point_id"
            :loading="collectionPoints.length == 0"
            label="Luogo di Rilascio"
            class="mt-2"
            :items="collectionPoints.concat([{name: 'Veicolo', id: 0}])"
            item-title="name"
            item-value="id"
          />
        </template>
        <v-row>
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
              v-if="order.delay && !isMobile"
              style="width: 50%; height: 100%;"
              class="d-flex justify-center align-center"
            >
              <v-text-field
                v-model="order.start_time_slot"
                label="Time Slot Start"
                type="time"
                :rules="validation.requiredRules"
                dense
                hide-details
                style="max-width: 115px; margin-right: 15px;"
              />
              <v-text-field
                v-model="order.end_time_slot"
                label="Time Slot End"
                type="time"
                :rules="validation.futureTime(order.start_time_slot)"
                dense
                hide-details
                style="max-width: 115px;"
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
          <div
            v-if="order.delay && isMobile"
            style="width: 100%; height: 100%;"
          >
            <p>Time slot in ritardo</p>
            <v-text-field
              v-model="order.start_time_slot"
              label="Time Slot Start"
              type="time"
              :rules="validation.requiredRules"
              dense
              style="width: 100%;"
            />
            <v-text-field
              v-model="order.end_time_slot"
              label="Time Slot End"
              type="time"
              :rules="validation.futureTime(order.start_time_slot)"
              dense
              style="width: 100%;"
            />
          </div>
        </v-row>
        <div v-if="order.status === 'Delivered'">
          <label>Firma del cliente</label>
          <SignaturePad
            ref="signaturePad"
            width="auto"
            :height="200"
            pen-color="black"
            background-color="white"
            style="border: 1px solid #ccc;"
          />
          <p
            v-if="signatureError"
            class="text-error"
            style="font-size: 12px; padding-inline: 16px;"
          >
            {{ signatureError }}
          </p>
          <p
            v-if="signatureSuccess"
            class="text-success"
            style="font-size: 12px; padding-inline: 16px;"
          >
            {{ signatureSuccess }}
          </p>
          <v-row no-gutters>
            <v-col cols="6">
              <v-btn
                class="mt-2 mr-3"
                block
                :color="theme.current.value.primaryColor"
                @click="clearSignature"
              >
                Cancella
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="mt-2 ml-3"
                block
                :color="theme.current.value.primaryColor"
                @click="saveSignature"
              >
                Salva Firma
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <FormButtons
          :loading="loading"
          @cancel="emits('cancel')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import SignaturePad from 'vue3-signature-pad';
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleItemStore } from '@/stores/scheduleItem';

const form = ref(null);
const theme = useTheme();
const loading = ref(false);
const router = useRouter();
const signaturePad = ref(null);
const collectionPoints = ref([]);
const signatureError = ref(null);
const signatureSuccess = ref(null);
const emits = defineEmits(['cancel']);
const isMobile = mobile.setupMobileUtils();

const orderStore = useOrderStore();
const scheduleItemStore = useScheduleItemStore();
const { element: order } = storeToRefs(orderStore);

order.value.id = order.value.order_id;
if (order.value.status == 'To Reschedule')
  http.getRequest(`order/collection-points/${order.value.id}`, {}, (data) => {
    if (data.status == 'ok')
      collectionPoints.value = data.collection_points;
  }, 'GET', router);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  if (order.value.status === 'Delivered' && signaturePad.value.isEmpty()) {
    signatureError.value = 'La firma non può essere vuota';
    return;
  }

  loading.value = true;
  orderStore.updateElementWithFormData(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      scheduleItemStore.initList(router);
      order.value = {};
      emits('cancel');
    }
  });
};

const clearSignature = () => {
  signatureError.value = null;
  signatureSuccess.value = null;
  signaturePad.value.signaturePad.clear();
};

const saveSignature = () => {
  if (signaturePad.value.isEmpty()) {
    signatureError.value = 'La firma non può essere vuota';
    return;
  }
  signatureError.value = null;
  const dataURL = signaturePad.value.toDataURL('image/png');

  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  const file = new File([u8arr], `firma_${order.value.id}.png`, { type: mime });

  order.value.signature = file;
  signatureSuccess.value = 'Firma salvata correttamente';
};
</script>
