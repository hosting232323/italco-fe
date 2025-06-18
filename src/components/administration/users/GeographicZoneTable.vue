<template>
  <v-data-table
    :items="geographicZones"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Nome', value: 'name' },
      { title: 'Vincoli', value: 'constraint' }
    ]"
  >
    <template v-slot:item.users="{ item }">
      {{ item.users.map(user => user.email).join(', ') }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-account-group"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="emits('openPopUp', item, 'customerGroup')"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const emits = defineEmits(['openPopUp']);
const geographicZoneStore = useGeographicZoneStore();
const geographicZones = storesUtils.getStoreList(geographicZoneStore, router);

// const deleteItem = (item) => {
//   customerGroupStore.deleteElement(item, router, function() {
//     customerGroupStore.initList(router);
//   });
// };
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
