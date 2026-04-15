<template>
  <v-expansion-panels
    v-model="panel"
    class="mt-10 mb-5"
  >
    <v-expansion-panel :color="theme.current.value.primaryColor">
      <v-expansion-panel-title>
        <h3>Filtri</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="mt-5">
        <v-form
          ref="form"
          @submit.prevent="filterRaeProduct"
        >
          <DateFilters
            element="RaeProduct"
            :filter-types="storesUtils.RAE_PRODUCT_FILTER_TYPES"
          />
          <FormButtons
            :loading="false"
            @cancel="panel = null"
          />
        </v-form>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import DateFilters from '@/components/DateFilters';

import { ref } from 'vue';
import { useTheme } from 'vuetify';
import storesUtils from '@/utils/stores';

const panel = ref(null);
const theme = useTheme();

const filterRaeProduct = async () => {};
</script>
