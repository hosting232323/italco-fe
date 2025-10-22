<template>
  <v-form
    ref="form"
    class="mb-5"
    @submit.prevent="submitForm"
  >
    <v-row no-gutters>
      <v-col
        cols="12"
        md="6"
      >
        <v-autocomplete
          v-model="object.user_id"
          :class="isMobile ? '' : 'mr-2'"
          label="Utente"
          :items="users.filter(user => user.role == 'Customer')"
          item-title="nickname"
          item-value="id"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="object.price"
          type="number"
          :class="isMobile ? '' : 'ml-2'"
          prepend-icon="mdi-currency-eur"
          label="Prezzo"
          :rules="validation.requiredRules"
        />
      </v-col>
    </v-row>
    <FormButtons
      :loading="loading"
      @cancel="emits('closeForm');"
    />
  </v-form>
  <v-alert
    v-if="message"
    class="mt-5 mb-5"
  >
    {{ message }}
  </v-alert>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useServiceStore } from '@/stores/service';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const object = ref({});
const message = ref('');
const loading = ref(false);
const router = useRouter();
const serviceStore = useServiceStore();
const emits = defineEmits(['closeForm']);
const isMobile = mobile.setupMobileUtils();
const administrationUserStore = useAdministrationUserStore();
const { element: service } = storeToRefs(serviceStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  serviceStore.createServiceUserRelationships(object.value, router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      serviceStore.initList(router);
      service.value.users.push(data.service_user);
      emits('closeForm');
    } else
      message.value = data.error;
  });
};
</script>
