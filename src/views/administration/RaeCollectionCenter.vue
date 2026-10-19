<template>
  <v-container class="table-page">
    <PageHeader title="Gestione Centro di Raccolta">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo centro di raccolta"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm"
      />
    </PageHeader>
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
import PageHeader from '@/components/PageHeader';
import CollectionCenterForm from '@/components/administration/raeCollectionCenter/CollectionCenterForm';
import CollectionCenterTable from '@/components/administration/raeCollectionCenter/CollectionCenterTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';

const theme = useTheme();
const raeCollectionCenterStore = useRaeCollectionCenterStore();
const { activeForm, element: raeCollectionCenter } = storeToRefs(raeCollectionCenterStore);

const openForm = () => {
  raeCollectionCenter.value = {};
  activeForm.value = true;
};
</script>
