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
        :title="`${item.day}: ${item.maxOrders} ordini max`"
        append-icon="mdi-delete"
        @click:append="removeConstraint(index)"
      />
    </v-list>

    <FormButtons
      :loading="loading"
      @cancel="emits('closeForm')"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import { ref } from 'vue';
import validation from '@/utils/validation';
import mobile from '@/utils/mobile';

const isMobile = mobile.setupMobileUtils();


const form = ref(null);
const loading = ref(false);
const emits = defineEmits(['closeForm', 'saveConstraints']);

// Campi del form
const day = ref('');
const maxOrders = ref('');
const constraints = ref([]); // lista dei vincoli salvati

const weekDays = [
  'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì',
  'Venerdì', 'Sabato', 'Domenica'
];

// Aggiunge un vincolo alla lista
function addConstraint() {
  if (!day.value || !maxOrders.value) return;

  constraints.value.push({
    day: day.value,
    maxOrders: Number(maxOrders.value),
  });

  // Reset dei campi
  day.value = '';
  maxOrders.value = '';
}

// Rimuove un vincolo dalla lista
function removeConstraint(index) {
  constraints.value.splice(index, 1);
}

// Submit finale del form
async function submitForm() {
  if (!(await form.value.validate()).valid || constraints.value.length === 0) return;

  loading.value = true;

  // Qui puoi mandare constraints.value al backend o a uno store
  console.log('Salvo i vincoli:', constraints.value);

  loading.value = false;
  emits('closeForm');
}
</script>
