<template>
  <SelectionTable
    v-model="selected"
    :ready="ready"
    :items="pickupPoints"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Indirizzo', value: 'address', sortable: false },
      { title: 'Cap', value: 'cap', sortable: false },
      { title: 'Clienti', value: 'customers', sortable: false }
    ]"
    multiple
    fill
  >
    <template #[`item.customers`]="{ item }">
      {{ customersLabel(item) }}
    </template>
    <template #actions="{ item, selected: selectedItems }">
      <v-btn
        v-if="item"
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
      />
      <v-btn
        v-if="item"
        prepend-icon="mdi-delete"
        text="Elimina"
        variant="text"
        :disabled="item.customers.length > 0"
        :title="item.customers.length ? 'Usato dai punti di ritiro dei clienti: unisci o scollega prima' : undefined"
        :loading="deleteLoading[item.id]"
        @click="deleteItem(item)"
      />
      <v-btn
        v-if="selectedItems.length > 1"
        prepend-icon="mdi-call-merge"
        text="Unisci"
        variant="text"
        @click="openMerge(selectedItems)"
      />
    </template>
  </SelectionTable>
  <v-dialog
    v-model="mergeDialog"
    max-width="700"
  >
    <v-card
      title="Unisci punti di ritiro"
      subtitle="Scegli la voce da mantenere: i punti di ritiro dei clienti delle altre passano a lei"
    >
      <v-card-text>
        <v-radio-group v-model="mergeTarget">
          <v-radio
            v-for="item in mergeItems"
            :key="item.id"
            :value="item.id"
            :label="`${item.name} · ${item.address} (${item.cap}) · ${customersLabel(item)}`"
          />
        </v-radio-group>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text="Annulla"
          @click="mergeDialog = false"
        />
        <v-btn
          text="Unisci"
          color="primary"
          :disabled="!mergeTarget"
          :loading="mergeLoading"
          @click="merge"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { usePickupPointStore } from '@/stores/pickupPoint';

const deleteLoading = reactive({});
const selected = ref([]);
const mergeDialog = ref(false);
const mergeItems = ref([]);
const mergeTarget = ref(null);
const mergeLoading = ref(false);

const pickupPointStore = usePickupPointStore();
const { element: pickupPoint, activeForm, ready } = storeToRefs(pickupPointStore);
const pickupPoints = storesUtils.getStoreList(pickupPointStore);

const customersLabel = (item) => {
  if (!item.customers.length) return '-';
  return [...new Set(item.customers.map(customer => customer.nickname))].join(', ');
};

const openForm = (item) => {
  pickupPoint.value = item;
  activeForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  pickupPointStore.deleteElement(item, function() {
    pickupPointStore.initList();
    deleteLoading[item.id] = false;
  });
};

const openMerge = (items) => {
  mergeItems.value = items;
  mergeTarget.value = mergeItems.value[0]?.id ?? null;
  mergeDialog.value = true;
};

const merge = () => {
  mergeLoading.value = true;
  const sourceIds = mergeItems.value.map(item => item.id).filter(id => id != mergeTarget.value);
  pickupPointStore.mergeElements(mergeTarget.value, sourceIds, function(data) {
    mergeLoading.value = false;
    if (data.status != 'ok') return;
    mergeDialog.value = false;
    selected.value = [];
    pickupPointStore.initList();
  });
};
</script>
