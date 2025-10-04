<template>
  <v-container>
    <h1>
      Punti di Ritiro
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <CollectionPointForm />
    <CollectionPointTable />
  </v-container>
</template>

<script setup>
import CollectionPointForm from '@/components/customers/collectionPoints/CollectionPointForm';
import CollectionPointTable from '@/components/customers/collectionPoints/CollectionPointTable';

import { storeToRefs } from 'pinia';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const collectionPointStore = useCollectionPointStore();
const { activeForm, element: collectionPoint } = storeToRefs(collectionPointStore);

const openForm = () => {
  collectionPoint.value = {};
  activeForm.value = true;
};
</script>
