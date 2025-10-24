<template>
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
      <v-autocomplete
        v-model="filters['CustomerGroup.id']"
        :class="isMobile ? '' : 'ml-2 mr-2'"
        label="GDO"
        :items="customerGroups"
        item-title="name"
        item-value="id"
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
        v-model="filters['User.id']"
        :class="isMobile ? '' : 'ml-2'"
        label="Utenti Delivery"
        :items="users.filter(user => user.role == 'Delivery')"
        item-title="name"
        item-value="id"
        clearable
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useCustomerGroupStore } from '@/stores/customerGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const router = useRouter();
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const customerGroupStore = useCustomerGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { filters } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore, router);
const customerGroups = storesUtils.getStoreList(customerGroupStore, router);
</script>
