<template>
  <v-card
    v-if="entryForm"
    :title="element.id ? `Modifica blocco ID ${element.id}` : 'Nuovo blocco di copertura'"
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
              v-model="element.day_of_week"
              label="Giorno"
              :items="days.weekDays"
              item-title="title"
              item-value="value"
              :class="isMobile ? '' : 'mr-2'"
              :rules="validation.requiredRulesWithZero"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-autocomplete
              v-model="element.transport_id"
              label="Veicolo"
              :items="transports"
              item-title="name"
              item-value="id"
              :class="isMobile ? '' : 'ml-2'"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="element.start_time"
              type="time"
              label="Dalle"
              :class="isMobile ? '' : 'mr-2'"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="element.end_time"
              type="time"
              label="Alle"
              :class="isMobile ? '' : 'ml-2'"
              :rules="validation.futureTime(element.start_time)"
            />
          </v-col>
        </v-row>
        <v-combobox
          v-model="element.caps"
          label="CAP coperti"
          multiple
          chips
          closable-chips
          hint="Scrivi un CAP e premi Invio per aggiungerlo, puoi inserirne più di uno"
          persistent-hint
          :rules="validation.arrayRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="entryForm = false"
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
import storesUtils from '@/utils/stores';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useTransportStore } from '@/stores/transport';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();

const store = useDeliveryCoverageStore();
const { element, entryForm } = storeToRefs(store);

const transportStore = useTransportStore();
const transports = storesUtils.getStoreList(transportStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  const done = (data) => {
    loading.value = false;
    if (data.status == 'ok') {
      store.initList();
      element.value = {};
      entryForm.value = false;
    } else {
      alert(data.message);
    }
  };

  if (element.value.id) store.updateEntry(done);
  else store.createEntry(done);
};
</script>
