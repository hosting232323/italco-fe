<template>
  <v-card
    title="Crea Utente"
    :subtitle="`Utenti disponibili: ${MAX_USERS - users.length}`"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text v-if="MAX_USERS - users.length > 0">
      <v-form ref="form" @submit.prevent="submitForm">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="user.email"
              label="Nickname"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="user.password"
              label="Password"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-select
          v-model="user.role"
          label="Ruolo"
          :items="['Operator', 'Customer', 'Delivery']"
          :rules="validation.requiredRules"
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
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const MAX_USERS = 40;

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoresList(administrationUserStore, router);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  administrationUserStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      user.value = {};
      administrationUserStore.initList(router);
      activeForm.value = false;
    }
  });
};
</script>
