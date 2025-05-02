<template>
  <v-container>
    <h1>
      Prodotti
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <ProductForm />
    <ProductTable />
  </v-container>
</template>

<script setup>
import ProductForm from '@/components/customers/products/Form';
import ProductTable from '@/components/customers/products/Table';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';

const router = useRouter();
const productStore = useProductStore();
const { activeForm, element: product } = storeToRefs(productStore);
productStore.initList(router);

const openForm = () => {
  product.value = {};
  activeForm.value = true;
};
</script>
