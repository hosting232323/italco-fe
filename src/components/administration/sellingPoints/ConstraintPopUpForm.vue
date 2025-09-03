<template>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-select
          v-model="day"
          label="Giorno della settimana"
          :items="days.weekDays"
          :rules="[(value) => !!value || value === 0 || 'Seleziona un giorno']"
          :class="isMobile ? '' : 'mr-2'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="maxOrders"
          label="Massimo ordini"
          type="number"
          min="1"
          :rules="validation.requiredRules"
          :class="isMobile ? '' : 'mr-2'"
        />
      </v-col>
    </v-row>
    <FormButtons
      :loading="loading"
      @cancel="emits('closeForm')"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import days from '@/utils/days';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['closeForm']);
const isMobile = mobile.setupMobileUtils();
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);

const day = ref('');
const maxOrders = ref('');

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  geographicZoneStore.createEntity({
    day_of_week: day.value,
    max_orders: Number(maxOrders.value)
  }, 'constraint', router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      geographicZoneStore.initList(router);
      geographicZone.value.constraints.push(data.entity);
      emits('closeForm');
    }
  })
}
</script>
