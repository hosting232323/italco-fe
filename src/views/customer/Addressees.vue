<template>
  <v-container>
    <h1>
      Anagrafiche
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <AddresseeForm />
    <AddresseeTable />
  </v-container>
</template>

<script setup>
import AddresseeForm from '@/components/customers/addressees/Form';
import AddresseeTable from '@/components/customers/addressees/Table';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAddresseeStore } from '@/stores/addressees';

const router = useRouter();
const addresseeStore = useAddresseeStore();
const { activeForm, element: addressee } = storeToRefs(addresseeStore);
addresseeStore.initList(router);

const openForm = () => {
  addressee.value = {};
  activeForm.value = true;
};
</script>
