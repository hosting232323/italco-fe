<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <div
    v-else
    class="selection-table-area"
    :class="{ 'selection-table-area--fill': fill }"
  >
    <v-data-table
      v-model="selected"
      class="selection-table"
      fixed-header
      :show-select="hasActions"
      :select-strategy="multiple ? undefined : 'single'"
      :return-object="returnObject"
      :item-value="itemValue"
      :items="items"
      :headers="headers"
      :items-per-page="25"
      :items-per-page-options="[10, 25, 50, 100]"
    >
      <template
        v-for="name in itemSlots"
        #[name]="slotProps"
      >
        <slot
          :name="name"
          v-bind="slotProps"
        />
      </template>
      <template #bottom>
        <div class="selection-table-bottom">
          <div
            v-if="selectedItems.length"
            class="selection-bar"
            :style="{ background: theme.current.value.primaryColor }"
          >
            <span class="font-weight-medium mx-2">
              {{ selectedItems.length == 1 ? '1 selezionato' : `${selectedItems.length} selezionati` }}
            </span>
            <slot
              name="actions"
              :item="selectedItems.length == 1 ? selectedItems[0] : null"
              :selected="selectedItems"
            />
            <v-btn
              icon="mdi-close"
              variant="text"
              title="Deseleziona tutto"
              @click="selected = []"
            />
          </div>
          <v-spacer />
          <v-data-table-footer />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { computed, watch, useSlots } from 'vue';
import { useTheme } from 'vuetify';

// Tabella a scorrimento diretto: le colonne scorrono con l'intestazione fissa e
// i comandi della riga selezionata stanno in una barra in basso a sinistra,
// accanto alla paginazione (slot "actions"), al posto della colonna Azioni.
const {
  items, headers, ready, fill, multiple, returnObject, itemValue
} = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    required: true
  },
  ready: {
    type: Boolean,
    default: true
  },
  // Pagina con una sola tabella: occupa la viewport e scorre solo la tabella
  // (la pagina deve avere la classe "table-page").
  fill: {
    type: Boolean,
    default: false
  },
  // Selezione multipla; di default si seleziona una riga alla volta.
  multiple: {
    type: Boolean,
    default: false
  },
  returnObject: {
    type: Boolean,
    default: false
  },
  itemValue: {
    type: [String, Function],
    default: 'id'
  }
});

const theme = useTheme();
const slots = useSlots();
const selected = defineModel({ type: Array, default: () => [] });

const hasActions = computed(() => !!slots.actions);
const itemSlots = computed(() => Object.keys(slots).filter(name => name != 'actions'));

const getId = (item) => {
  if (typeof itemValue === 'function') return itemValue(item);
  return itemValue.split('.').reduce((value, key) => value?.[key], item);
};

const selectedItems = computed(() => {
  if (returnObject) return selected.value;
  const byId = new Map(items.map(item => [getId(item), item]));
  return selected.value.map(id => byId.get(id)).filter(Boolean);
});

// Una riga sparita dalla lista (eliminata, filtrata) non resta selezionata.
watch(() => items, (list) => {
  if (!selected.value.length) return;
  const ids = new Set(list.map(getId));
  const kept = selected.value.filter(value => ids.has(returnObject ? getId(value) : value));
  if (kept.length != selected.value.length) selected.value = kept;
});
</script>
