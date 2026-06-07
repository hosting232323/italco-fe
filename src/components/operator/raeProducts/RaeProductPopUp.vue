<template>
  <v-card
    :title="`Modifica Rae ${rae.id}`"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <RaeProductPopUpEmittedForm
        v-if="initialStatus == 'Emitted'"
        @cancel="emits('cancel')"
      />
      <RaeProductPopUpLdrForm
        v-else-if="initialStatus == 'LDR'"
        @cancel="emits('cancel')"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import RaeProductPopUpLdrForm from '@/components/operator/raeProducts/RaeProductPopUpLdrForm';
import RaeProductPopUpEmittedForm from '@/components/operator/raeProducts/RaeProductPopUpEmittedForm';

import { storeToRefs } from 'pinia';
import { useRaeProductStore } from '@/stores/raeProduct';

const raeProductStore = useRaeProductStore();
const { element: rae } = storeToRefs(raeProductStore);

const emits = defineEmits(['cancel']);
const initialStatus = rae.value.status;
</script>
