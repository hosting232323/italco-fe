<template>
  <v-card
    v-if="activeForm"
    :title="raeCollectionCenter.id ? `Modifica Centro di Raccolta ${raeCollectionCenter.id}` : 'Crea Centro di Raccolta'"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="raeCollectionCenter.company_name"
              label="Nome"
              :class="isMobile ? '' : 'mr-2'"
              :items="orderUtils.TYPES"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="raeCollectionCenter.address"
              :class="isMobile ? '' : 'mr-2'"
              label="Indirizzo"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="raeCollectionCenter.fiscal_code"
              label="Codice Fiscale"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="raeCollectionCenter.vat_number"
              label="Partita IVA"
              :class="isMobile ? '' : 'mr-2'"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="raeCollectionCenter.authorization_code"
              label="Codice di Autorizzazione"
              :class="isMobile ? '' : 'mr-2'"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="raeCollectionCenter.authorization_date"
              label="Data di autorizzazione"
              type="date"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import validation from '@/utils/validation';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();

const raeCollectionCenterStore = useRaeCollectionCenterStore();
const { activeForm, element: raeCollectionCenter } = storeToRefs(raeCollectionCenterStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (raeCollectionCenter.value.id)
    raeCollectionCenterStore.updateElement(callback);
  else
    raeCollectionCenterStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    raeCollectionCenter.value = {};
    raeCollectionCenterStore.initList();
    activeForm.value = false;
  }
};
</script>
