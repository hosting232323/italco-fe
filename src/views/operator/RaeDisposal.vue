<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <h1>Smaltimento</h1><hr>
        <DisposalTable @open-dialog="dialog = true" />
      </v-container>
    </template>
    <template #default>
      <DisposalPopUp @cancel="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import DisposalTable from '@/components/operator/raeDisposal/DisposalTable';
import DisposalPopUp from '@/components/operator/raeDisposal/DisposalPopUp';

import { ref } from 'vue';

const dialog = ref(false);
</script>
