<template>
  <v-form @submit.prevent="submitForm" class="mb-5">
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-autocomplete
          :class="isMobile ? '' : 'mr-2'"
          v-model="object.user_id"
          label="Utente"
          :items="users.filter(user => user.role == 'Customer')"
          item-title="email"
          item-value="id"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          type="number"
          :class="isMobile ? '' : 'ml-2'"
          v-model="object.price"
          prepend-icon="mdi-currency-eur"
          label="Prezzo"
        />
      </v-col>
    </v-row>
    <FormButtons @cancel="emits('closeForm');" />
  </v-form>
  <v-alert class="mt-5 mb-5" v-if="message">
    {{ message }}
  </v-alert>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/stores/service';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const object = ref({});
const message = ref('');
const router = useRouter();
const serviceStore = useServiceStore();
const emits = defineEmits(['closeForm']);
const isMobile = mobile.setupMobileUtils();
const administrationUserStore = useAdministrationUserStore();
const { element: service } = storeToRefs(serviceStore);
const { list: users } = storeToRefs(administrationUserStore);

const submitForm = () => {
  message.value = '';
  serviceStore.createServiceUserRelationships(object.value, router, function (data) {
    if (data.status == 'ok') {
      serviceStore.initList(router);
      service.value.users.push(data.service_user);
      emits('closeForm');
    } else
      message.value = data.error;
  });
};
</script>
