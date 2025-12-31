<template>
  <v-card
    v-if="activeForm"
    :title="`Modifica Località per ${user.nickname} ID ${user.id}`"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-autocomplete
          v-model="cap"
          label="Località"
          :items="addressUtils.getCapItems()"
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
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import addressUtils from '@/utils/address';
import validation from '@/utils/validation';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const cap = ref(null);
const form = ref(null);
const loading = ref(false);
const router = useRouter();
const administrationUserStore = useAdministrationUserStore();
const { element: user, activeForm } = storeToRefs(administrationUserStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.postRequest('user/delivery-user-info', {
    cap: cap.value,
    user_id: user.value.id
  }, function () {
    loading.value = false;
    cap.value = null;
    administrationUserStore.initList(router);
    activeForm.value = false;
  }, 'POST', router);
};
</script>
