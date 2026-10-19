<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-container class="table-page">
        <PageHeader title="Ritiri Raee">
          <v-btn
            title="Schedario Ritiri Raee"
            prepend-icon="mdi-store-outline"
            text="Schedario ritiri RAEE"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="cardIndexDialog = true"
          />
        </PageHeader>
        <RaeProductFilters />
        <RaeProductTable @open-dialog="dialog = true" />
      </v-container>
    </template>
    <template #default>
      <RaeProductPopUp @cancel="dialog = false" />
    </template>
  </v-dialog>
  <v-dialog
    v-model="cardIndexDialog"
    max-width="700"
  >
    <RaeCardIndexPopUp @cancel="cardIndexDialog = false" />
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import RaeProductTable from '@/components/operator/raeProducts/RaeProductTable';
import RaeProductPopUp from '@/components/operator/raeProducts/RaeProductPopUp';
import RaeProductFilters from '@/components/operator/raeProducts/RaeProductFilters';
import RaeCardIndexPopUp from '@/components/operator/raeProducts/RaeCardIndexPopUp';

import { ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const dialog = ref(false);
const cardIndexDialog = ref(false);
</script>
