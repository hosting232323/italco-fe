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
          @submit.prevent="filterServices"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="filters['Service.name']"
                :class="isMobile ? '' : 'mr-2'"
                label="Nome"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-select
                v-model="filters['Service.type']"
                :class="isMobile ? '' : 'ml-2 mr-2'"
                label="Tipo"
                :items="orderUtils.TYPES"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="filters['User.id']"
                :class="isMobile ? '' : 'ml-2'"
                label="Punto Vendita"
                :items="customers"
                item-title="nickname"
                item-value="id"
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
import FormButtons from '@/components/FormButtons';

import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import orderUtils from '@/utils/order';
import storesUtils from '@/utils/stores';
import { useServiceStore } from '@/stores/service';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const panel = ref(null);
const theme = useTheme();
const isMobile = mobile.setupMobileUtils();

const serviceStore = useServiceStore();
const administrationUserStore = useAdministrationUserStore();
const { ready, filters } = storeToRefs(serviceStore);
const users = storesUtils.getStoreList(administrationUserStore);

// La lista utenti parte insieme a quella dei servizi, quando il token può essere
// scaduto e la risposta arriva vuota: si richiede di nuovo a servizi caricati.
watch(
  () => serviceStore.ready,
  (isReady) => {
    if (isReady && !users.value?.length) administrationUserStore.initList();
  },
  { immediate: true }
);

const customers = computed(() => (users.value || []).filter(user => user.role == 'Customer'));

const filterServices = async () => {
  if (!(await form.value.validate()).valid) return;

  ready.value = false;
  serviceStore.initList();
  panel.value = null;
};
</script>
