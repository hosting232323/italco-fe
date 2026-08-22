<template>
  <v-card
    v-if="activeForm"
    :title="company.id ? `Modifica Company ${company.id}` : 'Crea Company'"
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
            class="pr-md-2"
          >
            <v-text-field
              v-model="company.name"
              label="Nome company"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <label class="mr-2">Modulo RAEE</label>
            <v-radio-group
              v-model="company.rae"
              inline
            >
              <v-radio
                label="Sì"
                :value="true"
              />
              <v-radio
                label="No"
                :value="false"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <!-- Campi admin: solo in creazione -->
        <template v-if="!company.id">
          <v-divider class="my-4" />
          <div class="text-subtitle-1 mb-2">
            Amministratore della company
          </div>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="6"
              class="pr-md-2"
            >
              <v-text-field
                v-model="company.adminNickname"
                label="Nickname (usato per il login)"
                :rules="validation.requiredRules"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="company.adminPassword"
                label="Password"
                type="password"
                :rules="validation.requiredRules"
              />
            </v-col>
          </v-row>
        </template>
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

import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';

const form = ref(null);
const loading = ref(false);

const userStore = useUserStore();
const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (company.value.id)
    companyStore.updateElement(callback);
  else
    companyStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    // Se il super admin ha appena modificato la company su cui sta operando,
    // il flag RAEE in sessione è vecchio: menù e rotte deciderebbero sul dato
    // precedente fino al prossimo login.
    if (data.company && data.company.id == userStore.company?.id)
      userStore.company = data.company;

    company.value = {};
    companyStore.initList();
    activeForm.value = false;
  }
};

watch(activeForm, (val) => {
  if (val && company.value.rae == undefined) {
    company.value.rae = false;
  }
});
</script>
