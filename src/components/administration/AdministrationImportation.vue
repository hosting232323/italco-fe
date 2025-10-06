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
            <v-autocomplete
              v-model="user"
              label="Punto Vendita"
              :items="users.filter(user => user.role == 'Customer')"
              item-title="email"
              item-value="id"
              :rules="validation.requiredRules"
              @update:model-value="collectionPoint = null"
            />
            <v-autocomplete
              v-if="user"
              v-model="collectionPoint"
              label="Punto di Ritiro"
              :items="collectionPoints.filter(collectionPoint => collectionPoint.user_id == user)"
              item-title="name"
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
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const file = ref(null);
const form = ref(null);
const user = ref(null);
const loading = ref(false);
const router = useRouter();
const collectionPoint = ref(null);

const orderStore = useOrderStore();
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();
const { ready } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const submitForm = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.formDataRequest('import', {
    file: file.value,
    customer_id: user.value,
    collection_point_id: collectionPoint.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      ready.value = false;
      orderStore.initList(router);
      isActive.value = false;
    }
  }, 'POST', router);
};
</script>
