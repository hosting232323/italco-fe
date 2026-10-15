<template>
  <v-card
    v-if="point"
    class="preload-card"
    elevation="8"
  >
    <v-card-title class="d-flex align-center pr-2">
      <span class="text-truncate">{{ point.name }}</span>
      <v-spacer />
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="emits('close')"
      />
    </v-card-title>
    <v-card-subtitle>{{ point.address }}</v-card-subtitle>

    <v-card-text>
      <v-switch
        v-model="preloadValue"
        :disabled="!isAdmin || preloadLoading"
        :loading="preloadLoading"
        label="Precarico"
        color="primary"
        hide-details
        @update:model-value="savePreload"
      />
      <p class="text-medium-emphasis text-caption mt-2 mb-0">
        Con il precarico attivo, nelle aree che lo accettano i prodotti di questo punto si ritirano il giorno
        prima della consegna.
      </p>
      <v-alert
        v-if="!isAdmin"
        type="info"
        variant="tonal"
        density="compact"
        class="mt-3"
      >
        Il precarico può essere modificato solo da un amministratore.
      </v-alert>
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        class="mt-3"
      >
        {{ error }}
      </v-alert>

      <template v-if="point.preloaded">
        <v-divider class="my-4" />
        <h4 class="mb-1">
          Aree di precarico
        </h4>
        <p class="text-medium-emphasis text-caption mb-2">
          Senza aree vale la zona di copertura che accetta il precarico. Con almeno un'area, questo punto viene
          precaricato solo per gli indirizzi che ci cadono dentro.
        </p>

        <v-list
          v-if="areas.length"
          density="compact"
          class="pa-0"
        >
          <v-list-item
            v-for="area in areas"
            :key="area.id"
            class="px-0"
          >
            <v-list-item-title>{{ areaTitle(area) }}</v-list-item-title>
            <v-list-item-subtitle>{{ areaDescription(area) }}</v-list-item-subtitle>
            <template
              v-if="isAdmin"
              #append
            >
              <v-btn
                icon="mdi-pencil"
                size="x-small"
                variant="text"
                @click="editArea(area)"
              />
              <v-btn
                icon="mdi-delete"
                size="x-small"
                variant="text"
                color="error"
                :disabled="saving"
                @click="removeArea(area)"
              />
            </template>
          </v-list-item>
        </v-list>
        <p
          v-else
          class="text-caption mb-0"
        >
          Nessuna area configurata: vale la zona di copertura.
        </p>

        <v-form
          v-if="isAdmin"
          class="mt-3"
          @submit.prevent="saveArea"
        >
          <div class="text-subtitle-2 mb-1">
            {{ editingId ? 'Modifica area' : 'Nuova area' }}
          </div>
          <v-text-field
            v-model="form.name"
            label="Nome (facoltativo)"
            density="compact"
            hide-details
            class="mb-2"
          />
          <v-combobox
            v-model="form.caps"
            label="CAP"
            multiple
            chips
            closable-chips
            density="compact"
            hide-details
            hint="Scrivi un CAP e premi Invio"
            class="mb-2"
          />
          <div class="d-flex align-center flex-wrap mb-2">
            <v-btn
              size="small"
              variant="tonal"
              :color="drawing ? 'warning' : undefined"
              prepend-icon="mdi-vector-polygon"
              @click="emits('update:drawing', !drawing)"
            >
              {{ drawing ? 'Annulla disegno' : 'Disegna sulla mappa' }}
            </v-btn>
            <v-chip
              v-if="form.polygon"
              size="small"
              closable
              class="ml-2"
              @click:close="form.polygon = null"
            >
              Poligono ({{ form.polygon.length }} vertici)
            </v-chip>
          </div>
          <p
            v-if="drawing"
            class="text-caption text-warning mb-2"
          >
            Usa lo strumento poligono in alto a destra sulla mappa.
          </p>
          <div class="d-flex">
            <v-btn
              type="submit"
              color="primary"
              size="small"
              :loading="saving"
              :disabled="!canSave"
            >
              {{ editingId ? 'Salva' : 'Aggiungi area' }}
            </v-btn>
            <v-btn
              v-if="editingId || hasDraft"
              size="small"
              variant="text"
              class="ml-2"
              @click="resetForm"
            >
              Annulla
            </v-btn>
          </div>
        </v-form>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const props = defineProps({
  point: { type: Object, default: null },
  isAdmin: { type: Boolean, default: false },
  drawing: { type: Boolean, default: false },
  draftPolygon: { type: Array, default: null }
});
const emits = defineEmits(['close', 'update:drawing']);

const collectionPointStore = useCollectionPointStore();

const areas = computed(() => props.point?.preload_areas || []);

const preloadValue = ref(false);
const preloadLoading = ref(false);
const error = ref('');

const emptyForm = () => ({ name: '', caps: [], polygon: null });
const form = reactive(emptyForm());
const editingId = ref(null);
const saving = ref(false);

const hasDraft = computed(() => !!(form.name || form.caps.length || form.polygon));
const canSave = computed(() => form.caps.length > 0 || !!form.polygon);

const resetForm = () => {
  Object.assign(form, emptyForm());
  editingId.value = null;
  emits('update:drawing', false);
};

// Un altro punto selezionato: stato e form ripartono da quello.
watch(
  () => props.point?.id,
  () => {
    preloadValue.value = !!props.point?.preloaded;
    error.value = '';
    resetForm();
  },
  { immediate: true }
);

watch(() => props.point?.preloaded, (value) => { preloadValue.value = !!value; });

watch(
  () => props.draftPolygon,
  (polygon) => {
    if (!polygon) return;
    form.polygon = polygon;
    emits('update:drawing', false);
  }
);

const areaTitle = (area) => area.name || `Area ${area.id}`;
const areaDescription = (area) => {
  const parts = [];
  if (area.caps?.length) parts.push(`CAP ${area.caps.join(', ')}`);
  if (area.polygon?.length) parts.push(`poligono (${area.polygon.length} vertici)`);
  return parts.join(' + ');
};

const savePreload = (value) => {
  preloadLoading.value = true;
  error.value = '';
  collectionPointStore.element = { ...props.point, preloaded: !!value };
  collectionPointStore.updateElement((data) => {
    preloadLoading.value = false;
    if (data.status == 'ok') {
      collectionPointStore.initList();
      return;
    }
    // Il backend rifiuta lo spegnimento con ordini precaricati in sospeso: lo
    // switch torna sul valore salvato e il motivo resta leggibile.
    preloadValue.value = !value;
    error.value = data.message || 'Impossibile salvare il precarico';
  });
};

const editArea = (area) => {
  editingId.value = area.id;
  form.name = area.name || '';
  form.caps = [...(area.caps || [])];
  form.polygon = area.polygon ? [...area.polygon] : null;
};

const afterAreaRequest = (data) => {
  saving.value = false;
  if (data.status == 'ok') {
    resetForm();
    collectionPointStore.initList();
    return;
  }
  error.value = data.message || 'Impossibile salvare l\'area';
};

const saveArea = () => {
  if (!canSave.value) return;
  saving.value = true;
  error.value = '';
  const area = { name: form.name, caps: form.caps.map(String), polygon: form.polygon };
  if (editingId.value) collectionPointStore.updatePreloadArea(editingId.value, area, afterAreaRequest);
  else collectionPointStore.createPreloadArea(props.point.id, area, afterAreaRequest);
};

const removeArea = (area) => {
  saving.value = true;
  error.value = '';
  collectionPointStore.deletePreloadArea(area.id, (data) => {
    saving.value = false;
    if (data.status == 'ok') {
      if (editingId.value === area.id) resetForm();
      collectionPointStore.initList();
      return;
    }
    error.value = data.message || 'Impossibile eliminare l\'area';
  });
};
</script>

<style scoped>
.preload-card {
  width: 340px;
  max-width: calc(100% - 24px);
  max-height: calc(100% - 24px);
  overflow-y: auto;
}
</style>
