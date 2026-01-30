<template>
  <v-card
    v-if="activeForm"
    :title="`Modifica Dati Punto Vendita per ${user.nickname} ID ${user.id}`"
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
              :class="isMobile ? '' : 'ml-2'"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="data.email"
          label="Email"
        />
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
