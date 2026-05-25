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
        <v-file-input
          label="File PDF"
          accept="application/pdf"
          :rules="validation.requiredRules"
          :error-messages="fileError"
          @change="onFilesSelected"
        />
        <div
          v-if="file"
          class="mb-4"
        >
          <strong>PDF selezionato</strong>

          <v-card class="pdf-card">
            <v-card-text class="text-center">
              <v-icon
                size="64"
                color="red"
              >
                mdi-file-pdf-box
              </v-icon>

              <div class="pdf-name mt-2">
                {{ file.selectedFile.name }}
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-center">
              <v-btn
                icon="mdi-eye"
                variant="text"
                @click="openPdf(file)"
              />

              <v-btn
                icon="mdi-delete"
                variant="text"
                color="red"
                @click="file = null"
              />
            </v-card-actions>
          </v-card>
        </div>
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

const file = ref(null);
const form = ref(null);
const fileError = ref('');

const raeProductStore = useRaeProductStore();
const { element: rae, activePopUpForm } = storeToRefs(raeProductStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
};

const onFilesSelected = (event) => {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  fileError.value = '';

  if (selectedFile.type !== 'application/pdf') {
    fileError.value = 'Puoi caricare solo file PDF';
    return;
  }

  file.value = {
    selectedFile,
    preview: URL.createObjectURL(selectedFile),
  };
};
</script>
