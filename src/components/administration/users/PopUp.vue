<template>
  <v-card
    title="Associa utenti"
    :subtitle="`Gruppo: ${deliveryGroup.name}`"
  >
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-autocomplete
          v-model="userId"
          label="Utente"
          :items="users.filter(user => user.role == 'Delivery')"
          item-title="email"
          item-value="id"
        />
        <v-btn
          type="submit"
          text="Invia"
          block
          :color="theme.current.value.primaryColor"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const userId = ref(null);
const theme = useTheme();
const router = useRouter();
const props = defineProps(['isActive']);
const deliveryGroupStore = useDeliveryGroupStore();
const administrationUserStore = useAdministrationUserStore();
const { list: users } = storeToRefs(administrationUserStore);
const { element: deliveryGroup } = storeToRefs(deliveryGroupStore);

const submitForm = () => {
  deliveryGroupStore.assignUser(userId.value, router, function (data) {
    if (data.status == 'ok') {
      deliveryGroupStore.initList(router);
      deliveryGroup.value = {};
      props.isActive.value = false;
    }
  });
};
</script>
