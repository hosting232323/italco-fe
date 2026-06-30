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
              v-if="!disposal.first_copy_document_fir"
              label="First Copy FIR Document (PDF)"
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
              v-if="!disposal.fourth_copy_document_fir"
              label="Fourth Copy FIR Document (PDF)"
              accept="application/pdf"
              :error-messages="fileErrors.fourthCopy"
              :class="!isMobile ? 'ml-2' : ''"
              :disabled="!!disposal.fourth_copy_document_fir"
              @change="onFilesSelected('fourthCopy', $event)"
            />
            <div
              v-if="disposal.fourth_copy_document_fir?.selectedFile || (typeof disposal.fourth_copy_document_fir === 'string')"
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
        <FormButtons
          :loading="loading"
          :disabled="bothDocumentsLoaded"
          @cancel="emits('cancel')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import mobile from '@/utils/mobile';
import { useRaeDisposalStore } from '@/stores/raeDisposal';

const form = ref(null);
const fileErrors = reactive({ firstCopy: '', fourthCopy: '' });
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['cancel']);

const raeDisposalStore = useRaeDisposalStore();
const { element: disposal } = storeToRefs(raeDisposalStore);

const bothDocumentsLoaded = computed(() => {
  const firstLoaded = disposal.value.first_copy_document_fir;
  const fourthLoaded = disposal.value.fourth_copy_document_fir;
  return firstLoaded && fourthLoaded;
});


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
