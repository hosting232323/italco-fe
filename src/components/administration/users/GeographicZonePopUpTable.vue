<template>
  <!-- <v-data-table
    :items="geographicZone.users"
    :headers="[
      { title: 'Nickname', value: 'email' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        variant="text"
        @click="deleteItem(item)"
        :color="theme.current.value.primaryColor"
      />
    </template>
  </v-data-table> -->
  a
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);

const deleteItem = (item) => {
  geographicZoneStore.assignUser(item.id, router, function() {
    geographicZone.value.users = geographicZone.value.users.filter(user => user.id !== item.id);
    geographicZoneStore.initList(router);
  }, true);
};
</script>
