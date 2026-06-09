<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-container>
        <h1>
          Gestione Punto di Raccolta
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openForm"
          />
        </h1><hr>
        <CollectionCenterForm />
        <CollectionCenterTable :activator-props="activatorProps" />
      </v-container>
    </template>
  </v-dialog>
</template>

<script setup>
import CollectionCenterForm from '@/components/administration/rae/CollectionCenterForm';
import CollectionCenterTable from '@/components/administration/rae/CollectionCenterTable';

import { storeToRefs } from 'pinia';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';

const raeCollectionCenterStore = useRaeCollectionCenterStore();
const { activeForm, element: raeCollectionCenter } = storeToRefs(raeCollectionCenterStore);

const openForm = () => {
  raeCollectionCenter.value = {};
  activeForm.value = true;
};
</script>
