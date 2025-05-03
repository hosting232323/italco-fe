<template>
  <v-expansion-panels class="mt-10 mb-5" v-model="panel">
    <v-expansion-panel :color="theme.current.value.primaryColor">
      <v-expansion-panel-title>
        <h3>Filtri</h3>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="mt-5">
        <v-form @submit.prevent="filterOrder">
          <v-autocomplete
            v-if="role != 'Customer'"
            v-model="filters['ItalcoUser.id']"
            label="Punto Vendita"
            :items="users.filter(user => user.role == 'Customer')"
            item-title="email"
            item-value="id"
            clearable
          />
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-autocomplete
                :class="isMobile ? '' : 'mr-2'"
                v-model="filters['CollectionPoint.id']"
                label="Punto di Ritiro"
                :items="collectionPoints"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :class="isMobile ? '' : 'ml-2'"
                v-model="filters['Service.id']"
                label="Servizio"
                :items="services"
                item-title="name"
                item-value="id"
                clearable
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-text-field
                :class="isMobile ? '' : 'mr-2'"
                v-model="filters['Order.dpc']"
                label="Data Promessa al Cliente"
                type="date"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :class="isMobile ? '' : 'ml-2'"
                v-model="filters['Order.drc']"
                label="Data Richiesta dal Cliente"
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
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useCollectionPointStore } from '@/stores/collectionPoints';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const panel = ref(null);
const theme = useTheme();
const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();
const { role } = storeToRefs(userStore);
const { filters } = storeToRefs(orderStore);
const { list: services } = storeToRefs(serviceStore);
const { list: users } = storeToRefs(administrationUserStore);
const { list: collectionPoints } = storeToRefs(collectionPointStore);

const filterOrder = () => {
  orderStore.initList(router);
  panel.value = null;
};
</script>
