<template>
  <v-dialog
    v-if="!locationError"
    v-model="showForm"
    max-width="1500"
  >
    <template #activator>
      <div>
        <v-skeleton-loader
          v-if="!ready"
          type="table"
          :color="theme.current.value.secondaryColor"
          class="mt-5"
        />
        <div v-else>
          <br><b>
            Totale ordini: {{ totOrder }}
          </b><br><br>
          <DeliveryTimeline />
        </div>
      </div>
    </template>
    <template #default>
      <Form @cancel="showForm = false" />
    </template>
  </v-dialog>

  <div
    v-else-if="locationError"
    class="text-center mt-10"
  >
    <v-alert
      type="error"
      border="start"
      color="red"
      prominent
    >
      ⚠️ Per usare questa funzionalità devi <strong>abilitare la geolocalizzazione</strong>.<br>
      Ricarica la pagina e consenti i permessi quando richiesto.
    </v-alert>
  </div>
</template>

<script setup>
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useScheduleItemStore } from '@/stores/scheduleItem';
import Form from '@/components/delivery/DeliveryForm';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import DeliveryTimeline from './DeliveryTimeline.vue';

let watcherId = null;
const theme = useTheme();
const router = useRouter();
const locationError = ref(false);
const scheduleItemStore = useScheduleItemStore();
const { list: orders, ready, showForm } = storeToRefs(scheduleItemStore);

const totOrder = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0;

  return orders.value.filter(
    item => item.operation_type !== 'CollectionPoint'
  ).length;
});

onMounted(() => {
  if (!navigator.geolocation) {
    locationError.value = true;
    return;
  }

  let firstPositionHandled = false;
  watcherId = navigator.geolocation.watchPosition(
    position => {
      if (!firstPositionHandled) {
        firstPositionHandled = true;
        if (!ready.value) scheduleItemStore.initList(router);
      }

      http.postRequest('user/position', {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }, () => { }, 'POST', router);
    },
    () => locationError.value = true,
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );

  onUnmounted(() => {
    if (watcherId != null) navigator.geolocation.clearWatch(watcherId);
  });
});
</script>
