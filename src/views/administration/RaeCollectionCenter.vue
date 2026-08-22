<template>
  <v-container>
    <h1>
      Gestione Centro di Raccolta
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <CollectionCenterTable />
  </v-container>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <CollectionCenterForm />
  </v-dialog>
</template>

<script setup>
import CollectionCenterForm from '@/components/administration/raeCollectionCenter/CollectionCenterForm';
import CollectionCenterTable from '@/components/administration/raeCollectionCenter/CollectionCenterTable';

import { storeToRefs } from 'pinia';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';

const raeCollectionCenterStore = useRaeCollectionCenterStore();
const { activeForm, element: raeCollectionCenter } = storeToRefs(raeCollectionCenterStore);

const openForm = () => {
  raeCollectionCenter.value = {};
  activeForm.value = true;
};
</script>
