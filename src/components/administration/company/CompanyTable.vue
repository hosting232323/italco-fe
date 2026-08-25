<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="companies"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Modulo RAEE', key: 'rae', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.rae`]="{ item }">
      <v-icon
        :icon="item.rae ? 'mdi-check-circle' : 'mdi-close-circle'"
        :color="item.rae ? 'success' : 'grey'"
      />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            variant="text"
            :loading="selectLoading[item.id]"
            :color="theme.current.value.primaryColor"
            :prepend-icon="item.id == activeCompany?.id ? 'mdi-check-circle' : 'mdi-login-variant'"
            :text="item.id == activeCompany?.id ? 'Selezionata' : 'Opera come'"
            @click="selectItem(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';

defineProps({
  activatorProps: {
    type: Object,
    required: true
  }
});

const theme = useTheme();
const router = useRouter();
const selectLoading = reactive({});

const companyStore = useCompanyStore();
const { element: company, activeForm, ready } = storeToRefs(companyStore);
const { company: activeCompany } = storeToRefs(useUserStore());

const companies = storesUtils.getStoreList(companyStore);

const openForm = (item) => {
  company.value = { ...item };
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const selectItem = (item) => {
  selectLoading[item.id] = true;
  companyStore.selectElement(item, (data) => {
    selectLoading[item.id] = false;
    if (data.status == 'ok') router.push('/dashboard');
  });
};
</script>
