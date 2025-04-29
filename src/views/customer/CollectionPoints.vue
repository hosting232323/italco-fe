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
import CollectionPointForm from '@/components/customers/collectionPoints/Form';
import CollectionPointTable from '@/components/customers/collectionPoints/Table';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const router = useRouter();
const collectionPointStore = useCollectionPointStore();
const { activeForm, element: collectionPoint } = storeToRefs(collectionPointStore);
collectionPointStore.initList(router);

const openForm = () => {
  collectionPoint.value = {};
  activeForm.value = true;
};
</script>
