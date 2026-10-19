<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-container class="table-page">
        <PageHeader title="Smaltimento" />
        <DisposalTable @open-dialog="dialog = true" />
      </v-container>
    </template>
    <template #default>
      <DisposalPopUp @cancel="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import DisposalTable from '@/components/operator/raeDisposal/DisposalTable';
import DisposalPopUp from '@/components/operator/raeDisposal/DisposalPopUp';

import { ref } from 'vue';

const dialog = ref(false);
</script>
