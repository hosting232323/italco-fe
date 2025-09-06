<template>
  <v-card
    v-if="activeForm"
    title="Crea Regola"
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
            <v-select
              v-model="customerRule.day_of_week"
              label="Giorno della settimana"
              :items="days.weekDays"
              :rules="[(value) => !!value || value === 0 || 'Seleziona un giorno']"
              :class="isMobile ? '' : 'mr-2'"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="customerRule.max_orders"
              label="Massimo ordini"
              type="number"
              min="1"
              :rules="validation.requiredRules"
              :class="isMobile ? '' : 'mr-2'"
            />
          </v-col>
        </v-row>
        <v-autocomplete
          v-model="customerRule.user_id"
          label="Utente"
          :items="users.filter(user => user.role == 'Customer')"
          item-title="email"
          item-value="id"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import days from '@/utils/days';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useCustomerRuleStore } from '@/stores/customerRule';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const customerRuleStore = useCustomerRuleStore();
const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore, router);
const { element: customerRule, activeForm } = storeToRefs(customerRuleStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  customerRuleStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      customerRuleStore.initList(router);
      customerRule.value = {};
      activeForm.value = false;
    }
  });
};
</script>
