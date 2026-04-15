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
              md="6"
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
              md="6"
            >
              <v-text-field
                v-model="filters['Order.id']"
                :class="isMobile ? '' : 'ml-2'"
                label="ID Ordine"
                type="number"
                clearable
              />
            </v-col>
          </v-row>
          <DateFilters
            element="Schedule"
            :filter-types="storesUtils.SCHEDULE_DATE_FILTER_TYPES"
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
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
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
</script>
