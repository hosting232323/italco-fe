<template>
  <v-container>
    <h1>
      Configurazione Raggruppamenti Raee
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <RaeProductGroupForm />
    <RaeProductGroupTable />
  </v-container>
</template>

<script setup>
import RaeProductGroupForm from '@/components/administration/raeProducts/RaeProductGroupForm';
import RaeProductGroupTable from '@/components/administration/raeProducts/RaeProductGroupTable';

import { storeToRefs } from 'pinia';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';

const raeProductGroupStore = useRaeProductGroupStore();
const { activeForm, element: raeProductGroup } = storeToRefs(raeProductGroupStore);

const openForm = () => {
  raeProductGroup.value = {};
  activeForm.value = true;
};
</script>
