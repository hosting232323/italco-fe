<template>
  <v-card
    v-if="dialogOpen"
    :title="`Luoghi di smaltimento RAEE — ${companyName}`"
  >
    <v-card-text>
      <label class="mr-2">Modulo RAEE</label>
      <v-radio-group
        :model-value="raeValue"
        inline
        :disabled="raeLoading"
      >
        <v-radio
          label="Sì"
          :value="true"
          @click="setRae(true)"
        />
        <v-radio
          label="No"
          :value="false"
          @click="setRae(false)"
        />
      </v-radio-group>
      <v-alert
        v-if="raeError"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ raeError }}
      </v-alert>

      <template v-if="raeValue">
        <v-divider class="mb-4" />
        <div class="text-right mb-2">
          <v-btn
            icon="mdi-plus"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm"
          />
        </div>
        <RaeDisposalPlaceForm />
        <RaeDisposalPlaceTable />
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import RaeDisposalPlaceTable from './RaeDisposalPlaceTable';
import RaeDisposalPlaceForm from './RaeDisposalPlaceForm';

import http from '@/utils/http';
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const theme = useTheme();

const userStore = useUserStore();
const companyStore = useCompanyStore();
const { list: companies } = storeToRefs(companyStore);

const store = useCompanyRaeDisposalPlaceStore();
const { dialogOpen, companyId, element: place, activeForm } = storeToRefs(store);

const company = computed(() => companies.value?.find((item) => item.id == companyId.value));
const companyName = computed(() => company.value?.name ?? companyId.value);

// Stato desiderato del toggle, non (solo) quello confermato dal backend: un
// primo "Sì" senza nessun luogo va rifiutato dal server (vedi
// RAE_WITHOUT_PLACE_ERROR), ma la sezione dei luoghi deve restare visibile
// per poterne creare uno, non richiudersi sull'errore.
const raeValue = ref(false);
const raeError = ref('');
const raeLoading = ref(false);

watch(companyId, (id) => {
  if (!id) return;
  raeValue.value = !!company.value?.rae;
  raeError.value = '';
}, { immediate: true });

const setRae = (value) => {
  raeValue.value = value;
  raeError.value = '';
  raeLoading.value = true;

  http.makeRequest(
    `company/${companyId.value}`,
    'PUT',
    { body: { name: company.value.name, rae: value } },
    (data) => {
      raeLoading.value = false;
      if (data.status == 'ok') {
        companyStore.initList();
        // Stesso trattamento di CompanyForm: se e' la company su cui il
        // super admin sta operando, il flag in sessione va aggiornato subito.
        if (data.company && data.company.id == userStore.company?.id)
          userStore.company = data.company;
      } else {
        raeError.value = data.message;
      }
    }
  );
};

const openForm = () => {
  place.value = {};
  activeForm.value = true;
};
</script>
