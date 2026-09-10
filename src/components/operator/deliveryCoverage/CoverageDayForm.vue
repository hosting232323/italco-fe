<template>
  <v-form
    ref="form"
    class="mb-4"
    @submit.prevent="submitForm"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="dayOfWeek"
          label="Giorno"
          :items="availableDays"
          :class="isMobile ? '' : 'mr-2'"
          :rules="validation.requiredRulesWithZero"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="startTime"
          type="time"
          label="Dalle"
          :class="isMobile ? '' : 'mx-2'"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-text-field
          v-model="endTime"
          type="time"
          label="Alle"
          :class="isMobile ? '' : 'ml-2'"
          :rules="validation.futureTime(startTime)"
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

import { computed, ref } from 'vue';
import days from '@/utils/days';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['closeForm']);

const store = useDeliveryCoverageStore();
const { managedCoverage } = storeToRefs(store);

const dayOfWeek = ref(null);
const startTime = ref('08:00');
const endTime = ref('17:00');

// Un solo orario per giorno della settimana: i giorni già impostati spariscono
// dalla tendina (stesso vincolo lato backend).
const availableDays = computed(() => {
  const taken = new Set((managedCoverage.value?.days || []).map((day) => day.day_of_week));
  return days.weekDays.filter((day) => !taken.has(day.value));
});

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  store.createCoverageDay(
    managedCoverage.value.id,
    { day_of_week: dayOfWeek.value, start_time: startTime.value, end_time: endTime.value },
    (data) => {
      loading.value = false;
      if (data.status == 'ok') {
        store.initList();
        dayOfWeek.value = null;
        emits('closeForm');
      } else {
        alert(data.message);
      }
    }
  );
};
</script>
