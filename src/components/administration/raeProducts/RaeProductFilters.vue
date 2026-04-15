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
          <v-row no-gutters>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters['RaeProduct.status']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                label="Stato"
                :items="orderUtils.RAE_STATUS"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-text-field
                v-model="filters['Order.id']"
                :class="isMobile ? '' : 'mr-2'"
                label="ID Ordine"
                type="number"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                v-model="filters['User.id']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                label="Punto Vendita"
                :items="users.filter(user => user.role == 'Customer')"
                item-title="nickname"
                item-value="id"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-autocomplete
                v-model="filters['RaeProductGroup.id']"
                :class="isMobile ? '' : 'ml-2'"
                label="Raggruppamento Raee"
                :items="raeProductGroups"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
          </v-row>
          <DateFilters
            element="RaeProduct"
            :filter-types="storesUtils.RAE_PRODUCT_DATE_FILTER_TYPES"
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
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const panel = ref(null);
const theme = useTheme();
const router = useRouter();
const isMobile = mobile.setupMobileUtils();

const raeProductStore = useRaeProductStore();
const raeProductGroupStore = useRaeProductGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { ready, filters } = storeToRefs(raeProductStore);
const users = storesUtils.getStoreList(administrationUserStore, router);
const raeProductGroups = storesUtils.getStoreList(raeProductGroupStore, router);

const filterRaeProduct = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  raeProductStore.initList(router);
  panel.value = null;
};
</script>
