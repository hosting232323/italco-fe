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
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-file-input
              label="Documento FIR Prima Copia (PDF)"
              accept="application/pdf"
              :error-messages="fileErrors.firstCopy"
              :class="!isMobile ? 'mr-2' : ''"
              :disabled="!!disposal.first_copy_document_fir"
              @change="onFilesSelected('firstCopy', $event)"
            />
            <div
              v-if="disposal.first_copy_document_fir?.selectedFile"
              class="mb-4"
            >
              <v-card class="pdf-card">
                <v-card-text class="text-center">
                  <v-icon
                    size="64"
                    color="red"
                  >
                    mdi-file-pdf-box
                  </v-icon>

                  <div class="pdf-name mt-2">
                    {{ disposal.first_copy_document_fir.selectedFile.name }}
                  </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="justify-center">
                  <v-btn
                    icon="mdi-eye"
                    variant="text"
                    @click="openPdf(disposal.first_copy_document_fir)"
                  />

                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="red"
                    @click="disposal.first_copy_document_fir = null"
                  />
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-file-input
              label="Documento FIR Quarta Copia (PDF)"
              accept="application/pdf"
              :error-messages="fileErrors.fourthCopy"
              :class="!isMobile ? 'ml-2' : ''"
              :disabled="!!disposal.fourth_copy_document_fir"
              @change="onFilesSelected('fourthCopy', $event)"
            />
            <div
              v-if="disposal.fourth_copy_document_fir?.selectedFile"
              class="mb-4"
            >
              <v-card class="pdf-card">
                <v-card-text class="text-center">
                  <v-icon
                    size="64"
                    color="red"
                  >
                    mdi-file-pdf-box
                  </v-icon>

                  <div class="pdf-name mt-2">
                    {{ disposal.fourth_copy_document_fir.selectedFile.name }}
                  </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="justify-center">
                  <v-btn
                    icon="mdi-eye"
                    variant="text"
                    @click="openPdf(disposal.fourth_copy_document_fir)"
                  />

                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="red"
                    @click="disposal.fourth_copy_document_fir = null"
                  />
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
        <v-text-field
          v-model.number="disposal.weight"
          label="Peso"
          type="number"
          min="0"
        />
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

import { ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const form = ref(null);
const fileErrors = reactive({ firstCopy: '', fourthCopy: '' });
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['cancel']);

const raeDisposalStore = useRaeDisposalStore();
const { element: disposal } = storeToRefs(raeDisposalStore);


const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;

  raeDisposalStore.updateElementWithFormData((data) => {
    loading.value = false;
    if (data.status == 'ok') {
      raeDisposalStore.initList();
      disposal.value = {};
      emits('cancel');
    }
  });
};

const openPdf = (document) => {
  if (document.preview) {
    window.open(document.preview, '_blank');
  }
};

const onFilesSelected = (type, event) => {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;

  fileErrors[type] = '';

  if (selectedFile.type !== 'application/pdf') {
    fileErrors[type] = 'Puoi caricare solo file PDF';
    return;
  }

  const fieldName = type === 'firstCopy' ? 'first_copy_document_fir' : 'fourth_copy_document_fir';
  disposal.value[fieldName] = {
    selectedFile,
    preview: URL.createObjectURL(selectedFile),
  };
};
</script>
