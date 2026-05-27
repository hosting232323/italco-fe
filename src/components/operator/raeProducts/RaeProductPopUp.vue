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
          v-if="rae.document"
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
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useRaeProductStore } from '@/stores/raeProduct';

const form = ref(null);
const fileError = ref('');
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['cancel']);

const raeProductStore = useRaeProductStore();
const { element: rae } = storeToRefs(raeProductStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;
  if (rae.value.document)
    raeProductStore.updateElementWithFormData(router, callback);
  else
    raeProductStore.updateElement(router, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    raeProductStore.initList(router);
    emits('cancel');
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

  rae.value.document = {
    selectedFile,
    preview: URL.createObjectURL(selectedFile),
  };
};
</script>
