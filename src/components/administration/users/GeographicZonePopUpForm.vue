<template>
  <v-form ref="form" @submit.prevent="submitForm">
      <v-row no-gutters>
        <v-col cols="12" md="5">
          <v-select
            v-model="day"
            label="Giorno della settimana"
            :items="weekDays"
            :rules="validation.requiredRules"
            :class="isMobile ? '' : 'mr-2'"
          />
        </v-col>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="maxOrders"
            label="Massimo ordini"
            type="number"
            min="1"
            :rules="validation.requiredRules"
            :class="isMobile ? '' : 'mr-2'"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-btn
            icon="mdi-plus"
            variant="text"
            @click="addConstraint"
            :disabled="!day || !maxOrders"
          />
        </v-col>
      </v-row>

    <v-divider class="my-4" />

    <v-list v-if="constraints.length">
      <v-list-item
        v-for="(item, index) in constraints"
        :key="index"
        :title="`${item.day_of_week}: ${item.max_orders} ordini max`"
      >
        <template #append>
          <v-btn
            icon="mdi-delete"
            variant="text"
            @click.stop="removeConstraint(index)"
          />
        </template>
      </v-list-item>
    </v-list>

    <FormButtons
      :loading="loading"
      @cancel="emits('closeForm')"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import validation from '@/utils/validation';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const router = useRouter();

const geographicZoneStore = useGeographicZoneStore();
const { constraints, element: geographicZone, activeForm } = storeToRefs(geographicZoneStore);

const isMobile = mobile.setupMobileUtils();
const form = ref(null);
const loading = ref(false);
const emits = defineEmits(['closeForm', 'saveConstraints']);

const day = ref('');
const maxOrders = ref('');

const weekDays = [
  'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì',
  'Venerdì', 'Sabato', 'Domenica'
];

function addConstraint() {
  if (!day.value || !maxOrders.value) return;

  constraints.value.push({
    day_of_week: day.value,
    max_orders: Number(maxOrders.value),
  });

  day.value = '';
  maxOrders.value = '';
}

function removeConstraint(index) {
  constraints.value.splice(index, 1);
}

const submitForm = async () => {
  if (constraints.value.length == 0) return;

  loading.value = true;
  geographicZoneStore.createConstraint(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      geographicZoneStore.initList(router);
      geographicZone.value = {};
      activeForm.value = false;
    }
  })
}
</script>
