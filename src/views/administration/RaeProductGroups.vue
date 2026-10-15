<template>
  <v-container>
    <h1>
      Raggruppamenti
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <RaeProductGroupTable />
  </v-container>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <RaeProductGroupForm />
  </v-dialog>
</template>

<script setup>
import RaeProductGroupForm from '@/components/administration/raeProductGroups/RaeProductGroupForm';
import RaeProductGroupTable from '@/components/administration/raeProductGroups/RaeProductGroupTable';

import { storeToRefs } from 'pinia';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';

const raeProductGroupStore = useRaeProductGroupStore();
const { activeForm, element: raeProductGroup } = storeToRefs(raeProductGroupStore);

const openForm = () => {
  raeProductGroup.value = {};
  activeForm.value = true;
};
</script>
