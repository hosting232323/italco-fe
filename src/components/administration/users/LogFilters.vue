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
          <v-row no-gutters>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Log.id']"
                :class="isMobile ? '' : 'mr-2'"
                label="ID Ordine"
                type="number"
                clearable
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
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import FormButtons from '@/components/FormButtons';
import { useLogStore } from '@/stores/log';
import { storeToRefs } from 'pinia';

import http from '@/utils/http';
import { useRouter } from 'vue-router';

const logStore = useLogStore();
const { ready } = storeToRefs(logStore);

const panel = ref(null);
const theme = useTheme();
const router = useRouter();

const filterLogs = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  logStore.initList(router);
  panel.value = null;
};
</script>
