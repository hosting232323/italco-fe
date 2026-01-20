<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-microsoft-excel"
        style="float: right;"
        variant="text"
        v-bind="activatorProps"
      />
    </template>
    <template #default="{ isActive }">
      <v-card title="Importa Ordini">
        <v-card-text>
          <v-form
            v-if="conflictsOrders.length == 0"
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
              item-title="nickname"
              item-value="id"
              :rules="validation.requiredRules"
            />
            <FormButtons
              :loading="loading"
              @cancel="isActive.value = false"
            />
          </v-form>
          <OrderImportationConflicts
            v-else
            :is-active="isActive"
            :customer-id="user"
            :conflicts-orders="conflictsOrders"
            @cancel="closeConflictsForm"
            @delete-order="deleteOrder"
          />
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import OrderImportationConflicts from '@/components/administration/excel/OrderImportationConflicts';

import { ref } from 'vue';
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const file = ref(null);
const form = ref(null);
const user = ref(null);
const loading = ref(false);
const router = useRouter();
const conflictsOrders = ref([]);
const orderStore = useOrderStore();
const administrationUserStore = useAdministrationUserStore();

const { ready } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const submitForm = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.formDataRequest('excel-import', {
    file: file.value,
    customer_id: user.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      if (data.imported_orders_count > 0)
        alert(`Importati ${data.imported_orders_count} ordini con successo.`);

      if (data.conflicted_orders && Object.keys(data.conflicted_orders).length > 0)
        conflictsOrders.value = data.conflicted_orders;
      else {
        ready.value = false;
        orderStore.initList(router);
        isActive.value = false;
      }
    }
  }, 'POST', router);
};

const closeConflictsForm = (isActive) => {
  isActive.value = false;
  conflictsOrders.value = [];
};

const deleteOrder = (isActive, order) => {
  conflictsOrders.value.splice(conflictsOrders.value.indexOf(order), 1);
  if (conflictsOrders.value.length == 0)
    isActive.value = false;
};
</script>
