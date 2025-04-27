<template>
  <v-card
    :title="`Modifica Ordine ${order.id}`"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <p class="mb-2">
        Servizio: {{ order.service.name }}<br>
        Punto Vendita: {{ order.user.email }}
      </p>
      <v-form @submit.prevent="submitForm">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="order.operator_note"
              label="Note"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              :class="isMobile ? '' : 'ml-2'"
              :items="deliveryGroups"
              v-model="order.delivery_group_id"
              label="Gruppo di consegna"
              item-title="name"
              item-value="id"
            />
          </v-col>
        </v-row>
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: order, activeForm } = storeToRefs(orderStore);
const { list: deliveryGroups } = storeToRefs(deliveryGroupStore);

const submitForm = () => {
  loading.value = true;
  order.value.status = 'In Progress';
  orderStore.updateElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      order.value = {};
      activeForm.value = false;
    }
  });
}
</script>
