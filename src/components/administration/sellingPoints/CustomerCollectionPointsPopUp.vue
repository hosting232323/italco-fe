<template>
  <v-card
    title="Punti di Ritiro"
    :subtitle="customer.nickname"
  >
    <template #append>
      <v-btn
        icon="mdi-plus"
        variant="text"
        @click="openForm"
      />
    </template>
    <v-card-text>
      <CollectionPointTable />
    </v-card-text>
  </v-card>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <CollectionPointForm />
  </v-dialog>
</template>

<script setup>
import CollectionPointForm from '@/components/customers/collectionPoints/CollectionPointForm';
import CollectionPointTable from '@/components/customers/collectionPoints/CollectionPointTable';

import { storeToRefs } from 'pinia';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const props = defineProps({ customer: { type: Object, required: true } });

const collectionPointStore = useCollectionPointStore();
const { activeForm, element: collectionPoint } = storeToRefs(collectionPointStore);

const openForm = () => {
  collectionPoint.value = { user_id: props.customer.id };
  activeForm.value = true;
};
</script>
