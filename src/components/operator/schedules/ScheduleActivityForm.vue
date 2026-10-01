<template>
  <v-card
    :title="activity ? 'Modifica attività' : 'Aggiungi attività'"
    subtitle="Attività libera o contrattempo nel borderò"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="title"
          label="Titolo"
          :rules="validation.requiredRules"
        />
        <div class="mb-1 text-caption">
          Durata
        </div>
        <v-chip-group
          :model-value="durationMinutes"
          selected-class="text-primary"
          mandatory="force"
          @update:model-value="selectPreset"
        >
          <v-chip
            v-for="preset in activityUtils.DURATION_PRESETS"
            :key="preset"
            :value="preset"
            filter
            variant="outlined"
          >
            {{ activityUtils.formatDuration(preset) }}
          </v-chip>
        </v-chip-group>
        <v-text-field
          v-model.number="durationMinutes"
          label="Durata in minuti"
          type="number"
          min="0"
          suffix="min"
          :rules="activityUtils.durationRules"
        />
        <v-textarea
          v-model="note"
          label="Note (opzionale)"
          rows="2"
          auto-grow
          class="mt-4"
        />
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <AddressAutocomplete
              v-model="address"
              :api-key="GOOGLE_API_KEY"
              :formatted="true"
              :custom-class="isMobile ? '' : 'mr-2'"
              label="Luogo (opzionale)"
              :rules="addressRules"
              @address-components="handleAddressComponents"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="cap"
              :class="isMobile ? '' : 'ml-2'"
              label="CAP"
              :rules="capRules"
            />
          </v-col>
        </v-row>
        <FormButtons
          submit-text="Salva"
          @cancel="emits('close-form')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import { AddressAutocomplete } from 'generic-module';
import { GOOGLE_API_KEY } from '@/utils/googleMaps';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import activityUtils from '@/utils/activity';
import validation from '@/utils/validation';

// activity: l'attività da modificare; assente quando se ne crea una nuova.
const { activity } = defineProps({
  activity: {
    type: Object,
    default: null
  }
});

const form = ref(null);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['save', 'close-form']);

const title = ref(activity?.title || '');
const note = ref(activity?.note || '');
const address = ref(activity?.address || '');
const cap = ref(activity?.cap || '');
const durationMinutes = ref(activity?.duration_minutes || 0);

// Indirizzo e CAP vanno insieme (la mappa geocodifica da entrambi): il CAP è
// obbligatorio solo quando c'è un indirizzo, e viceversa.
const capRules = [
  (value) => {
    if (!value) return !address.value || 'Inserisci il CAP';
    return value.length === 5 || 'Il CAP deve essere di 5 caratteri';
  }
];

const addressRules = [
  (value) => !!value || !cap.value || 'Inserisci l\'indirizzo'
];

// Il chip selezionato riempie il campo dei minuti; con "mandatory" il gruppo
// non si deseleziona da solo, quindi un valore libero lo ignora.
const selectPreset = (value) => {
  if (value !== undefined && value !== null) durationMinutes.value = value;
};

const handleAddressComponents = (components) => {
  address.value = components.address;
  cap.value = components.cap;
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  emits('save', {
    title: title.value.trim(),
    note: note.value?.trim() || null,
    address: address.value?.trim() || null,
    cap: cap.value?.trim() || null,
    duration_minutes: Number(durationMinutes.value) || 0
  });
};
</script>
