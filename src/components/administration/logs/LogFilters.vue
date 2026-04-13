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
          @submit.prevent="filterLogs"
        >
          <v-autocomplete
            v-model="filters['User.id']"
            label="Utente"
            :items="users"
            item-title="nickname"
            item-value="id"
            clearable
          />
          <DateFilters
            element="Log"
            :filter-types="storesUtils.LOG_DATE_FILTER_TYPES"
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
import DateFilters from '@/components/DateFilters';
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useLogStore } from '@/stores/log';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const panel = ref(null);
const theme = useTheme();
const router = useRouter();

const logStore = useLogStore();
const administrationUserStore = useAdministrationUserStore();
const { filters, ready } = storeToRefs(logStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const filterLogs = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  logStore.initList(router);
  panel.value = null;
};
</script>
