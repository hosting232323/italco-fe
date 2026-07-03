<template>
  <v-card
    v-if="activeForm"
    :title="raeProductGroup.id ? `Modifica Raggruppamento Raee ${raeProductGroup.id}` : 'Crea Raggruppamento Raee'"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="raeProductGroup.name"
          label="Nome"
          :rules="validation.requiredRules"
        />
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="raeProductGroup.cer_code"
              :class="isMobile ? '' : 'mr-2'"
              label="Codice CER"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="raeProductGroup.group_code"
              :class="isMobile ? '' : 'ml-2'"
              label="Codice Raggruppamento"
              item-title="name"
              item-value="name"
              :items="orderUtils.raeGrouping"
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
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();
const raeProductGroupStore = useRaeProductGroupStore();
const { element: raeProductGroup, activeForm } = storeToRefs(raeProductGroupStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (raeProductGroup.value.id)
    raeProductGroupStore.updateElement(callback);
  else
    raeProductGroupStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    raeProductGroup.value = {};
    raeProductGroupStore.initList();
    activeForm.value = false;
  }
};
</script>
