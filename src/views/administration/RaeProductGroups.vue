<template>
  <v-container class="table-page">
    <PageHeader title="Raggruppamenti">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo raggruppamento"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm"
      />
    </PageHeader>
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
import PageHeader from '@/components/PageHeader';
import RaeProductGroupForm from '@/components/administration/raeProductGroups/RaeProductGroupForm';
import RaeProductGroupTable from '@/components/administration/raeProductGroups/RaeProductGroupTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';

const theme = useTheme();
const raeProductGroupStore = useRaeProductGroupStore();
const { activeForm, element: raeProductGroup } = storeToRefs(raeProductGroupStore);

const openForm = () => {
  raeProductGroup.value = {};
  activeForm.value = true;
};
</script>
