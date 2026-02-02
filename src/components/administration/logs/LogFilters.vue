
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
              md="6"
            >
              <v-autocomplete
                v-model="filters['User.id']"
                :class="isMobile ? '' : 'mr-2'"
                label="Utente"
                :items="users"
                item-title="nickname"
                item-value="id"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="filters['Log.created_at']"
                label="Data"
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
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useLogStore } from '@/stores/log';
import FormButtons from '@/components/FormButtons';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const panel = ref(null);
const theme = useTheme();
const router = useRouter();
const logStore = useLogStore();
const isMobile = mobile.setupMobileUtils();
const { filters, ready } = storeToRefs(logStore);
const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore, router);

const filterLogs = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  logStore.initList(router);
  panel.value = null;
};
</script>