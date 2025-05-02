<template>
  <v-data-table
    :items="products"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Indirizzo', value: 'description' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useProductStore } from '@/stores/product';

const theme = useTheme();
const router = useRouter();
const productStore = useProductStore();
const { list: products, element: product, activeForm } = storeToRefs(productStore);

const openForm = (item) => {
  product.value = item;
  activeForm.value = true;
};

const deleteItem = (item) => {
  productStore.deleteElement(item, router, function() {
    productStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
