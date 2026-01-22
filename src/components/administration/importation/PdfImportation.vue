<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-file-pdf-box"
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
              label="File PDF"
              accept="application/pdf"
              :rules="validation.requiredRules"
              multiple
              @change="onFilesSelected"
            />

            <div
              v-if="files.length > 0"
              class="mb-4"
            >
              <strong>PDF selezionati</strong>

              <v-row>
                <v-col
                  v-for="(file, index) in files"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card
                    class="pdf-card"
                  >
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
                        @click="removeFile(index)"
                      />
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <v-autocomplete
              v-model="user"
              label="Punto Vendita"
              :items="users.filter(user => user.role == 'Customer')"
              item-title="nickname"
              item-value="id"
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
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const files = ref([]);
const form = ref(null);
const user = ref(null);
const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const administrationUserStore = useAdministrationUserStore();

const { ready } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const submitForm = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  const content = {customer_id: user.value};
  files.value.forEach(file => {
    if (file.selectedFile)
      content[file.selectedFile.name] = file.selectedFile;
  });

  http.formDataRequest(
    'import/pdf',
    content, 
    function (data) {
      loading.value = false;
      if (data.status == 'ok' && data.imported_orders_count > 0) {
        alert(`Importati ${data.imported_orders_count} ordini con successo.`);

        files.value = [];
        user.value = null;

        ready.value = false;
        orderStore.initList(router);
        isActive.value = false;
      }
    }, 'POST', router);
};

const onFilesSelected = (event) => {
  const selectedFiles = event.target.files;
  if (selectedFiles.length == 0) return;

  selectedFiles.forEach(selectedFile => {
    if (selectedFile.type != 'application/pdf') return;
    files.value.push({
      selectedFile,
      preview: URL.createObjectURL(selectedFile)
    });
  });
};

const openPdf = (file) => {
  window.open(file.preview, '_blank');
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};
</script>
