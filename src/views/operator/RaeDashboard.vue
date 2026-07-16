<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <v-row
          no-gutters
          align="center"
          justify="space-between"
        >
          <h1>Ritiri Raee</h1>
          <v-tooltip text="Schedario Ritiri Raee">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-store-outline"
                variant="text"
                :color="theme.current.value.primaryColor"
                @click="cardIndexDialog = true"
              />
            </template>
          </v-tooltip>
        </v-row>
        <hr>
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
