<template>
  <v-card
    v-if="activeForm"
    :title="`Modifica Informazioni Raee per ${user.nickname} ID ${user.id}`"
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
            md="6"
          >
            <v-text-field
              v-model="data.city"
              label="Città"
              :rules="validation.requiredRules"
              :class="isMobile ? '' : 'mr-2'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="data.address"
              label="Indirizzo"
              :rules="validation.requiredRules"
              :class="isMobile ? '' : 'ml-2'"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="data.tax_code"
              label="Codice Fiscale"
              :rules="validation.requiredRules"
              :class="isMobile ? '' : 'mr-2'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="data.company_name"
              label="Ragione Sociale"
              :rules="validation.requiredRules"
              :class="isMobile ? '' : 'ml-2'"
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
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const data = ref({});
const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();

const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm } = storeToRefs(administrationUserStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.postRequest('user/info', {
    data: data.value,
    class: 'Customer',
    user_id: user.value.id
  }, function () {
    loading.value = false;
    data.value = {};
    administrationUserStore.initList(router);
    activeForm.value = false;
  }, 'POST', router);
};
</script>
