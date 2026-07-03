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
          v-if="initialStatus !== 'Annulled'"
          v-model="rae.status"
          label="Tipo"
          :items="orderUtils.RAE_STATUS.filter(
            status => ['Emitted', 'LDR', 'Annulled'].includes(status.value)
          )"
          :rules="validation.requiredRules.concat([
            (value) => {
              if (value != 'Emitted') return true;
              return 'Aggiorna stato';
            }
          ])"
        />
        <v-file-input
          label="File PDF"
          accept="application/pdf"
          :error-messages="fileError"
          :rules="validation.requiredRules"
          @change="onFilesSelected"
        />
        <div
          v-if="rae.document?.selectedFile"
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
                {{ rae.document.selectedFile.name }}
              </div>
            </v-card-text>

            <v-divider />

            <v-card-actions class="justify-center">
              <v-btn
                icon="mdi-eye"
                variant="text"
                @click="openPdf(rae.document)"
              />

              <v-btn
                icon="mdi-delete"
                variant="text"
                color="red"
                @click="rae.document = null"
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
import orderUtils from '@/utils/order';
import validation from '@/utils/validation';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const form = ref(null);
const fileError = ref('');
const loading = ref(false);
const emits = defineEmits(['cancel']);

const raeProductStore = useRaeProductStore();
const raeDisposalStore = useRaeDisposalStore();
const { element: rae } = storeToRefs(raeProductStore);
const initialStatus = ref(rae.value.status);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;

  raeProductStore.updateElementWithFormData((data) => {
    loading.value = false;
    if (data.status == 'ok') {
      raeProductStore.initList();
      raeDisposalStore.initList();
      emits('cancel');
    }
  });
};

const onFilesSelected = (event) => {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  fileError.value = '';

  if (selectedFile.type !== 'application/pdf') {
    fileError.value = 'Puoi caricare solo file PDF';
    return;
  }

  rae.value.document = {
    selectedFile,
    preview: URL.createObjectURL(selectedFile),
  };
};
</script>
