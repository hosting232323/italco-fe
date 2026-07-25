<template>
  <v-card
    title="Schedario Ritiri Raee"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="exportCardIndex"
      >
        <v-autocomplete
          v-model="userId"
          label="Punto Vendita"
          :items="users.filter(user => user.role == 'Customer')"
          item-title="nickname"
          item-value="id"
          :rules="validation.requiredRules"
        />
        <v-select
          v-model="year"
          label="Anno"
          :items="years"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          submit-text="Esporta"
          @cancel="emits('cancel')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['cancel']);

const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore, router);

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i);

const userId = ref(null);
const year = ref(currentYear);

const exportCardIndex = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.downloadRequest(
    `export/rae/card-index/${userId.value}/${year.value}`,
    'GET',
    { session: !!router },
    () => loading.value = false
  );
};
</script>
