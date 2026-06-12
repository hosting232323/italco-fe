<template>
  <v-card
    v-if="selectedProducts.some(p => p.status != 'LDR')"
    title="Puoi smaltire solo prodotti in stato LDR"
  />
  <v-card
    v-else
    :title="`Smaltimento di ${selectedProducts.length} prodotti RAE`"
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
            <v-text-field
              v-model="disposal.date"
              type="date"
              :class="isMobile ? '' : 'mr-2'"
              label="Data"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="disposal.code"
              :class="isMobile ? '' : 'ml-2'"
              label="Codice"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="disposal.carrier_id"
              :class="isMobile ? '' : 'mr-2'"
              label="Trasportatore"
              :items="raeCarriers"
              item-title="company_name"
              item-value="id"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="disposal.collection_center_id"
              :class="isMobile ? '' : 'ml-2'"
              label="Centro di raccolta"
              :items="raeCollectionCenters"
              item-title="company_name"
              item-value="id"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>

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
          class="mb-5"
          @cancel="emits('cancel')"
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
import { useRaeCarrierStore } from '@/stores/raeCarrier';
import { useRaeDisposalStore } from '@/stores/raeDisposal';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';

const router = useRouter();
const isMobile = mobile.setupMobileUtils();

const raeCarrierStore = useRaeCarrierStore();
const raeCarriers = storesUtils.getStoreList(raeCarrierStore, router);

const raeCollectionCenterStore = useRaeCollectionCenterStore();
const raeCollectionCenters = storesUtils.getStoreList(raeCollectionCenterStore, router);

const form = ref(null);
const loading = ref(null);
const fileError = ref('');
const emits = defineEmits(['cancel', 'success']);
const raeDisposalStore = useRaeDisposalStore();
const { element: disposal } = storeToRefs(raeDisposalStore);

defineProps({
  selectedProducts: {
    type: Array,
    required: true
  }
});

const openPdf = (document) => {
  if (document.preview) {
    window.open(document.preview, '_blank');
  }
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;

  raeDisposalStore.createElementWithFormData(router, (data) => {
    loading.value = false;
    if (data.status == 'ok') {
      raeDisposalStore.initList(router);
      emits('cancel');
      emits('success');
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

  disposal.value.document = {
    selectedFile,
    preview: URL.createObjectURL(selectedFile),
  };
};
</script>
