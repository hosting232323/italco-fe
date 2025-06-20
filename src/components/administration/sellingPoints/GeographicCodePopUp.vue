<template>
  <v-card
    title="CAP aggiunti o rimossi"
    :subtitle="`Area: ${geographicZone.name}`"
  >
    <template v-slot:append>
      <v-btn
        icon="mdi-plus"
        @click="formFlag = true"
        variant="text"
      />
    </template>
    <v-card-text>
      <PopUpForm v-if="formFlag" @closeForm="formFlag = false" />
      <PopUpTable v-if="geographicZone.codes.length > 0" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import PopUpForm from '@/components/administration/sellingPoints/GeographicCodePopUpForm';
import PopUpTable from '@/components/administration/sellingPoints/GeographicCodePopUpTable';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const formFlag = ref(false);
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);
</script>
