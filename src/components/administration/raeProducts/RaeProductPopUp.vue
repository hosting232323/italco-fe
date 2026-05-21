<template>
  <v-card
    :title="`Modifica Rae ${rae.id}`"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-select
          v-model="rae.status"
          label="Tipo"
          :items="orderUtils.RAE_STATUS.filter(
            status => ['LDR', 'Annulled'].includes(status.value)
          )"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="activePopUpForm = false"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import http from '@/utils/http';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useRaeProductStore } from '@/stores/raeProduct';

const form = ref(null);
const raeProductStore = useRaeProductStore();
const { element: rae, activePopUpForm } = storeToRefs(raeProductStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
};
</script>
