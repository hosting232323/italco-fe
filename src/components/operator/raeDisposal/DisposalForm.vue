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
        <!-- Con un solo luogo lo si prende di default, senza mostrare nulla:
        il selettore compare solo quando c'è davvero da scegliere. -->
        <v-row
          v-if="raeDisposalPlaces.length > 1"
          no-gutters
        >
          <v-col cols="12">
            <v-autocomplete
              v-model="disposal.rae_disposal_place_id"
              label="Luogo di smaltimento"
              :items="raeDisposalPlaces"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <FormButtons
          class="mb-5"
          :loading="loading"
          @cancel="emits('cancel')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useRaeProductStore } from '@/stores/raeProduct';
import { useRaeCarrierStore } from '@/stores/raeCarrier';
import { useRaeDisposalStore } from '@/stores/raeDisposal';
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';
import { useRaeDisposalPlaceStore } from '@/stores/raeDisposalPlace';

const isMobile = mobile.setupMobileUtils();

const raeCarrierStore = useRaeCarrierStore();
const raeCarriers = storesUtils.getStoreList(raeCarrierStore);

const raeCollectionCenterStore = useRaeCollectionCenterStore();
const raeCollectionCenters = storesUtils.getStoreList(raeCollectionCenterStore);

const raeDisposalPlaceStore = useRaeDisposalPlaceStore();
const raeDisposalPlaces = storesUtils.getStoreList(raeDisposalPlaceStore);

const form = ref(null);
const loading = ref(false);
const emits = defineEmits(['cancel', 'success']);
const raeProductStore = useRaeProductStore();
const raeDisposalStore = useRaeDisposalStore();
const { element: disposal } = storeToRefs(raeDisposalStore);

const { selectedProducts } = defineProps({
  selectedProducts: {
    type: Array,
    required: true
  }
});

// Con un solo luogo non c'è scelta da fare: lo si imposta da solo, anche se
// il selettore resta nascosto.
watch(raeDisposalPlaces, (places) => {
  if (places.length === 1) disposal.value.rae_disposal_place_id = places[0].id;
}, { immediate: true });

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  loading.value = true;

  disposal.value.rae_product_ids = selectedProducts.map(p => p.id);
  raeDisposalStore.createElement((data) => {
    loading.value = false;
    if (data.status == 'ok') {
      disposal.value = {};
      raeProductStore.initList();
      raeDisposalStore.initList();
      emits('cancel');
      emits('success');
    }
  });
};
</script>
