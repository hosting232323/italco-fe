<template>
  <v-container>
    <h1>
      Prodotti Raee
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <RaeProductForm />
    <RaeProductTable />
  </v-container>
</template>

<script setup>
import RaeProductForm from '@/components/administration/raeProducts/RaeProductForm';
import RaeProductTable from '@/components/administration/raeProducts/RaeProductTable';

import { storeToRefs } from 'pinia';
import { useRaeProductStore } from '@/stores/raeProduct';

const raeProductStore = useRaeProductStore();
const { activeForm, element: raeProduct } = storeToRefs(raeProductStore);

const openForm = () => {
  raeProduct.value = {};
  activeForm.value = true;
};
</script>
