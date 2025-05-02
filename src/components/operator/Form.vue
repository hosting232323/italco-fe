<template>
  <v-card
    :title="`Modifica Ordine ${order.id}`"
    class="mt-10 mb-5"
    v-if="activeSecondForm"
  >
    <v-card-text>
      <p class="mb-2">
        Servizio: {{ order.services.map(service => service.name).join(', ') }}<br>
        Punto Vendita: {{ order.user.email }}
      </p>
      <v-form ref="form" @submit.prevent="submitForm">
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
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <FormButtons
          :loading="loading"
          @cancel="activeSecondForm = false"
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
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: order, activeSecondForm } = storeToRefs(orderStore);
const { list: deliveryGroups } = storeToRefs(deliveryGroupStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  order.value.status = 'In Progress';
  orderStore.updateElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      order.value = {};
      activeSecondForm.value = false;
    }
  });
}
</script>
