<template>
  <v-container class="table-page">
    <PageHeader title="Punti di Ritiro">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo punto di ritiro"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm"
      />
    </PageHeader>
    <CollectionPointTable fill />
  </v-container>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <CollectionPointForm />
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import CollectionPointForm from '@/components/customers/collectionPoints/CollectionPointForm';
import CollectionPointTable from '@/components/customers/collectionPoints/CollectionPointTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const theme = useTheme();
const collectionPointStore = useCollectionPointStore();
const { activeForm, element: collectionPoint } = storeToRefs(collectionPointStore);

const openForm = () => {
  collectionPoint.value = {};
  activeForm.value = true;
};
</script>
