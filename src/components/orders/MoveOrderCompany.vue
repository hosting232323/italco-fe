<template>
  <v-card :title="`Sposta l'ordine ${order.id} in un'altra company`">
    <v-card-text>
      <v-autocomplete
        v-model="companyId"
        label="Company di destinazione"
        :items="companies"
        item-title="name"
        item-value="id"
        :disabled="loading"
      />
      <v-autocomplete
        v-if="plan?.target_users?.length > 1"
        v-model="userId"
        label="Punto vendita di destinazione"
        :items="plan.target_users"
        item-title="nickname"
        item-value="id"
        :disabled="loading"
      />

      <v-progress-linear
        v-if="previewing"
        indeterminate
        class="mb-4"
      />
      <template v-else-if="plan">
        <p v-if="plan.source_user">
          Punto vendita: <b>{{ plan.source_user.nickname }}</b>
          <template v-if="plan.target_user">
            → <b>{{ plan.target_user.nickname }}</b>
          </template>
          <br>
          <span style="font-size: smaller;">Ragione Sociale: {{ plan.source_user.company_name || '-' }}</span>
        </p>

        <v-list
          v-if="plan.services.length || plan.collection_points.length"
          density="compact"
        >
          <v-list-item
            v-for="service in plan.services"
            :key="`service-${service.name}`"
            :title="service.name"
            :prepend-icon="service.target_service_user_id ? 'mdi-check-circle' : 'mdi-alert-circle'"
            :base-color="service.target_service_user_id ? 'success' : 'error'"
          />
          <v-list-item
            v-for="point in plan.collection_points"
            :key="`point-${point.name}-${point.address}`"
            :title="`${point.name} - ${point.address}`"
            :prepend-icon="point.target_collection_point_id ? 'mdi-check-circle' : 'mdi-alert-circle'"
            :base-color="point.target_collection_point_id ? 'success' : 'error'"
          />
        </v-list>

        <v-alert
          v-if="plan.errors.length"
          type="error"
          class="mt-3"
        >
          <div
            v-for="error in plan.errors"
            :key="error"
          >
            {{ error }}
          </div>
        </v-alert>
        <v-alert
          v-else
          type="success"
          class="mt-3"
          text="Tutto è collegabile: l'ordine verrà spostato con i dati equivalenti della nuova company."
        />
      </template>

      <v-alert
        v-if="message"
        class="mt-3"
        type="error"
        :text="message"
      />

      <v-row
        no-gutters
        class="mt-3"
      >
        <v-col cols="10">
          <v-btn
            block
            text="Sposta ordine"
            :loading="loading"
            :disabled="!canMove"
            :color="theme.current.value.primaryColor"
            @click="move"
          />
        </v-col>
        <v-spacer />
        <v-col cols="1">
          <v-btn
            block
            variant="text"
            icon="mdi-close"
            :disabled="loading"
            :color="theme.current.value.primaryColor"
            @click="emits('cancel')"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const { order } = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const plan = ref(null);
const userId = ref(null);
const theme = useTheme();
const message = ref('');
const companyId = ref(null);
const loading = ref(false);
const previewing = ref(false);
const emits = defineEmits(['cancel']);

const companies = ref([]);
const orderStore = useOrderStore();
const { ready } = storeToRefs(orderStore);
const canMove = computed(() => !!plan.value && !plan.value.errors.length && !!plan.value.target_user);

// Il backend elenca già solo le altre company: l'ordine si sposta fuori da quella
// su cui si sta operando. Non si usa lo store delle company, riservato al super admin.
onMounted(() => {
  http.makeRequest('order/company-targets', 'GET', {}, function (data) {
    if (data.status == 'ok')
      companies.value = data.companies;
    else
      message.value = data.message;
  });
});

// Le risposte dell'anteprima possono arrivare fuori ordine: conta solo l'ultima richiesta.
let previewRequest = 0;

const preview = () => {
  message.value = '';
  plan.value = null;
  if (!companyId.value) return;

  const request = ++previewRequest;
  previewing.value = true;
  http.makeRequest(`order/${order.id}/company/preview`, 'POST', {
    body: { company_id: companyId.value, user_id: userId.value }
  }, function (data) {
    if (request != previewRequest) return;
    previewing.value = false;
    if (data.status == 'ok')
      plan.value = data.plan;
    else
      message.value = data.message;
  });
};

// Cambiare company azzera la scelta del punto vendita, che apparteneva a quella precedente.
watch(companyId, () => {
  userId.value = null;
  preview();
});
watch(userId, preview);

const move = () => {
  message.value = '';
  loading.value = true;
  http.makeRequest(`order/${order.id}/company`, 'POST', {
    body: { company_id: companyId.value, user_id: userId.value }
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      ready.value = false;
      orderStore.initList();
      emits('cancel');
    } else {
      message.value = data.message;
      if (data.plan) plan.value = data.plan;
    }
  });
};
</script>
