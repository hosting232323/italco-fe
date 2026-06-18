<template>
  <v-card
    :title="`Modifica Smaltimento ${disposal.id}`"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-file-input
          label="File PDF"
          accept="application/pdf"
          :error-messages="fileError"
          :rules="validation.requiredRules"
          @change="onFilesSelected"
        />
        <div
          v-if="disposal.document?.selectedFile"
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
                {{ disposal.document.selectedFile.name }}
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-center">
              <v-btn
                icon="mdi-eye"
                variant="text"
                @click="openPdf(disposal.document)"
              />

              <v-btn
                icon="mdi-delete"
                variant="text"
                color="red"
                @click="disposal.document = null"
              />
            </v-card-actions>
          </v-card>
        </div>
        <FormButtons
          :loading="loading"
          @cancel="emits('cancel')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const form = ref(null);
const fileError = ref('');
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['cancel']);

const raeDisposalStore = useRaeDisposalStore();
const { element: disposal } = storeToRefs(raeDisposalStore);


const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;

  raeDisposalStore.updateElementWithFormData(router, (data) => {
    loading.value = false;
    if (data.status == 'ok') {
      raeDisposalStore.initList(router);
      emits('cancel');
    }
  });
};

const openPdf = (document) => {
  if (document.preview) {
    window.open(document.preview, '_blank');
  }
};

const onFilesSelected = (event) => {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  fileError.value = '';

  if (selectedFile.type !== 'application/pdf') {
    fileError.value = 'Puoi caricare solo file PDF';
    return;
  }

  disposal.value.document = {
    selectedFile,
    preview: URL.createObjectURL(selectedFile),
  };
};
</script>
