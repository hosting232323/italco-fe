<template>
  <v-card
    title="Crea Aree Geografica"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-autocomplete
          v-model="geographicZone.name"
          :items="filteredProvinces"
          item-title="name"
          label="Provincia"
          :rules="validation.requiredRules"
          clearable
          hide-no-data
          hide-selected
          v-model:search="search"
          return-object
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
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useGeographicZoneStore } from '@/stores/geographicZone';
import provinces from '@/utils/provinces';

const search = ref('');
const form = ref(null);
const loading = ref(false);
const router = useRouter();
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone, activeForm } = storeToRefs(geographicZoneStore);

const filteredProvinces = computed(() => {
  if (search.value.length < 2) return [];
  const lowerSearch = search.value.toLowerCase();
  return provinces.filter(prov =>
    prov.toLowerCase().includes(lowerSearch)
  );
});

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  geographicZoneStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      geographicZoneStore.initList(router);
      geographicZone.value = {};
      activeForm.value = false;
    }
  });
};
</script>
