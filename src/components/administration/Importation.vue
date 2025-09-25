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
          <v-row no-gutters>
            <v-col cols="6">
              <v-autocomplete
                v-model="order.user_id"
                label="Punto Vendita"
                :items="users.filter(user => user.role == 'Customer')"
                item-title="email"
                item-value="id"
                :rules="validation.requiredRules"
              />

            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="order.collection_point_id"
                :class="isMobile ? '' : 'ml-2'"
                label="Punto di Ritiro"
                :items="getCollectionPoints()"
                item-title="name"
                item-value="id"
                :rules="validation.requiredRules"
              />
            </v-col>
          </v-row>
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

import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import http from '@/utils/http';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';

import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useUserStore } from '@/stores/user';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const file = ref(null);
const form = ref(null);
const loading = ref(false);
const router = useRouter();

const userStore = useUserStore();
const { role } = storeToRefs(userStore);
const orderStore = useOrderStore();
const { element: order } = storeToRefs(orderStore);
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);


const getCollectionPoints = () => {
  return role.value == 'Customer' ? collectionPoints.value :
    collectionPoints.value.filter(collectionPoint => collectionPoint.user_id == order.value.user_id);
};

const submitForm = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.formDataRequest('import', {
    file: file.value,
    customerUser: order.value.user_id,
    collectionPoints: order.value.collection_point_id
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok')
      isActive.value = false;
  }, 'POST', router);
};
</script>
