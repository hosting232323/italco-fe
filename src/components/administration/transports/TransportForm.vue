<template>
  <v-card
    v-if="activeForm"
    :title="transport.id ? `Modifica Veicolo ${transport.id}` : 'Crea Veicolo'"
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
            <v-text-field
              v-model="transport.name"
              :class="isMobile ? '' : 'mr-2'"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="transport.plate"
              :class="isMobile ? '' : 'ml-2'"
              label="Targa"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-autocomplete
          v-model="transport.cap"
          label="Località"
          :items="addressUtils.getCapItems()"
        />
        <v-autocomplete
          v-model="selectedUserIds"
          label="Utenti Delivery"
          :items="selectableUsers"
          item-title="nickname"
          item-value="id"
          multiple
          chips
          closable-chips
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

import { ref, computed, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import addressUtils from '@/utils/address';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();

const transportStore = useTransportStore();
const administrationUserStore = useAdministrationUserStore();
const { element: transport, activeForm } = storeToRefs(transportStore);
const users = storesUtils.getStoreList(administrationUserStore);

const selectedUserIds = ref([]);

const deliveryUsers = computed(() => users.value.filter(user => user.role == 'Delivery'));

// Nella tendina restano solo gli utenti liberi e quelli già su questo veicolo:
// gli assegnati altrove sparirebbero comunque alla submit (un utente, un veicolo).
const selectableUsers = computed(() => deliveryUsers.value.filter(
  user => !user.delivery_user_info?.transport_id || user.delivery_user_info.transport_id == transport.value.id
));

watch(activeForm, (open) => {
  if (open) selectedUserIds.value = [...(transport.value.user_ids || [])];
}, { immediate: true });

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  transport.value.user_ids = selectedUserIds.value;
  if (transport.value.id)
    transportStore.updateElement(callback);
  else
    transportStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    transport.value = {};
    selectedUserIds.value = [];
    transportStore.initList();
    administrationUserStore.initList();
    activeForm.value = false;
  }
};
</script>
