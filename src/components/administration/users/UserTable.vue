<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-skeleton-loader
        v-if="!ready"
        type="table"
        :color="theme.current.value.secondaryColor"
        class="mt-5"
      />
      <v-data-table
        v-else
        :items="users"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="[
          { title: 'ID', value: 'id', sortable: false },
          { title: 'Nickname', value: 'nickname', sortable: false },
          { title: 'Password', value: 'password', sortable: false },
          { title: 'Email', value: 'email', sortable: false },
          { title: 'Ruolo', value: 'role', sortable: false },
          { title: 'Azioni', key: 'actions', sortable: false }
        ]"
      >
        <template #[`item.password`]="{ item }">
          <template v-if="item.role != 'Admin'">
            <v-btn
              :icon="visiblePasswords[item.id] ? 'mdi-eye' : 'mdi-eye-off'"
              variant="text"
              :color="theme.current.value.primaryColor"
              @click="togglePassword(item.id, item.password)"
            />
            <span :class="{ 'blur-password': !visiblePasswords[item.id] }">
              {{ visiblePasswords[item.id] ? decryptedPasswords[item.id] : '••••••••••••••••••••••••••••••••••••••••••••••••' }}
            </span>
          </template>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn
            v-if="item.role !== 'Admin'"
            icon="mdi-delete"
            variant="text"
            :loading="deleteLoading[item.id]"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </template>
      </v-data-table>
    </template>
    <template #default>
      <v-card title="Attenzione!">
        <v-card-text>
          <p>Stai per cancellare l'utente: <strong>{{ element.nickname }}</strong></p>
          <ul style="margin-left: 20px;">
            <li>Verranno rimossi {{ element.serviceUsers }} servizi collegati</li>
            <li>Verranno rimosse {{ element.customerRules }} regole personalizzate</li>
            <li>Verranno rimossi {{ element.collectionPoints }} punti di ritiro</li>
            <li v-if="element.blockedOrders > 0">
              Non sarà possibile cancellare l'utente perché ci sono {{ element.blockedOrders }} ordini attivi
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Annulla"
            :color="theme.current.value.primaryColor"
            @click="dialog = false"
          />
          <v-spacer />
          <v-btn
            text="Conferma"
            :color="theme.current.value.primaryColor"
            :disabled="element.blockedOrders > 0"
            @click="deleteItem(element, true)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { ref, reactive  } from 'vue';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { decryptPassword } from 'generic-module';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const secretKey = import.meta.env.VITE_SECRET_KEY;

const element = ref({});
const theme = useTheme();
const dialog = ref(false);
const router = useRouter();
const administrationUserStore = useAdministrationUserStore();
const { ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore, router);

const deleteLoading = reactive({});
const visiblePasswords = reactive({});
const decryptedPasswords = reactive({});

const togglePassword = (id, encrypted) => {
  if (!visiblePasswords[id]) {
    try {
      decryptedPasswords[id] = decryptPassword(encrypted, secretKey);
    } catch (e) {
      decryptedPasswords[id] = '[ERRORE DECIFRATURA]';
    }
  }
  visiblePasswords[id] = !visiblePasswords[id];
};

const deleteItem = (item, force = false) => {
  deleteLoading[item.id] = true;
  administrationUserStore.deleteElement(force, item, router, function(data) {
    if (data.status == 'ko') {
      dialog.value = true;
      element.value = { ...item, ...data.dependencies };
    } else {
      element.value = {};
      dialog.value = false;
      administrationUserStore.initList(router);
    }
    deleteLoading[item.id] = false;
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}

.blur-password {
  filter: blur(6px);
}
</style>
