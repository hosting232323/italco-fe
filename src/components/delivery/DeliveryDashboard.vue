<template>
  <v-dialog
    v-if="goNext"
    v-model="showForm"
    max-width="1500"
  >
    <template #activator>
      <DeliveryTimeline />
    </template>
    <template #default>
      <DeliveryForm @cancel="showForm = false" />
    </template>
  </v-dialog>
  <div
    v-if="locationError"
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
import DeliveryForm from '@/components/delivery/DeliveryForm';
import DeliveryTimeline from '@/components/delivery/DeliveryTimeline.vue';

import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { useScheduleItemStore } from '@/stores/scheduleItem';

let watcherId = null;
const router = useRouter();
const goNext = ref(false);
const locationError = ref(false);
const scheduleItemStore = useScheduleItemStore();
const { showForm } = storeToRefs(scheduleItemStore);

onMounted(() => {
  if (!navigator.geolocation) {
    locationError.value = true;
    return;
  }

  watcherId = navigator.geolocation.watchPosition(
    position => {
      http.postRequest('user/position', {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }, function () {
        goNext.value = true;
      }, 'POST', router);
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
