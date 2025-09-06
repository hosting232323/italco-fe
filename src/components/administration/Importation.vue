<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-import"
        style="float: right;"
        variant="text"
        v-bind="activatorProps"
      />
    </template>
    <template #default="{ isActive }">
      <v-card title="Importa Ordini">
        <v-card-text>
          <v-form
            ref="form"
            @submit.prevent="submitForm(isActive)"
          >
            <v-file-input
              v-model="file"
              label="File Excel"
              :rules="validation.requiredRules"
            />
            <FormButtons
              :loading="loading"
              @cancel="isActive.value = false"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';

const file = ref(null);
const form = ref(null);
const loading = ref(false);
const router = useRouter();

const submitForm = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.formDataRequest('import', {
    file: file.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok')
      isActive.value = false;
  }, 'POST', router);
};
</script>
