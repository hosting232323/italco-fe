<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="users.filter(user => user.role == 'Delivery')"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nickname', value: 'nickname', sortable: false },
      { title: 'Veicolo', value: 'transport', sortable: false }
    ]"
  >
    <template #[`item.transport`]="{ item }">
      {{ transportName(item) }}
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const theme = useTheme();

const transportStore = useTransportStore();
const administrationUserStore = useAdministrationUserStore();
const { ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);
const transports = storesUtils.getStoreList(transportStore);

// L'utente delivery non ha più una località sua: la sua posizione di partenza
// è quella del veicolo su cui sta, e il veicolo si assegna dal suo form.
const transportName = (item) => {
  const transportId = item.delivery_user_info?.transport_id;
  if (!transportId) return '';
  return transports.value.find(transport => transport.id == transportId)?.name || '';
};
</script>
