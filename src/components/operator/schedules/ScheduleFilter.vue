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
          @submit.prevent="filterOrder"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Schedule.id']"
                :class="isMobile ? '' : 'mr-2'"
                label="ID Borderò"
                type="number"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Order.id']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                label="ID Ordine"
                type="number"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Schedule.date_0']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                :rules="intervallRules('Schedule.date_1')"
                label="Inizio Intervallo Data Consegna"
                type="date"
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Schedule.date_1']"
                :class="isMobile ? '' : 'ml-2'"
                :rules="intervallRules('Schedule.date_0')"
                label="Fine Intervallo Data Consegna"
                type="date"
              />
            </v-col>
          </v-row>
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

import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import { useScheduleStore } from '@/stores/schedule';

const form = ref(null);
const panel = ref(null);
const theme = useTheme();
const router = useRouter();
const scheduleStore = useScheduleStore();
const isMobile = mobile.setupMobileUtils();
const { filters, ready } = storeToRefs(scheduleStore);

const filterOrder = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  scheduleStore.initList(router);
  panel.value = null;
};

const intervallRules = (otherKey) => {
  return [
    (value) => {
      if (value && !filters.value[otherKey]) return 'Usare entrambe le date per filtrare';
      return true;
    }
  ];
};
</script>
