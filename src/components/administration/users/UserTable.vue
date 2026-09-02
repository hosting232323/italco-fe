<template>
  <v-dialog
    v-model="deleteDialog"
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
        :headers="[
          { title: 'ID', value: 'id', sortable: false },
          { title: 'Email', value: 'email', sortable: false },
          { title: 'Ruolo', value: 'role', sortable: false },
          { title: 'Azioni', key: 'actions', sortable: false }
        ]"
      >
        <template #[`item.actions`]="{ item }">
          <template v-if="item.role !== 'Admin'">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              :color="theme.current.value.primaryColor"
              @click="openEditForm(item)"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              :loading="deleteLoading[item.id]"
              :color="theme.current.value.primaryColor"
              @click="deleteItem(item)"
            />
          </template>
        </template>
      </v-data-table>
    </template>
    <template #default>
      <v-card title="Attenzione!">
        <v-card-text>
          <p>Stai per cancellare l'utente: <strong>{{ element.email }}</strong></p>
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
            @click="deleteDialog = false"
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
import storesUtils from '@/utils/stores';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const element = ref({});
const theme = useTheme();
const deleteDialog = ref(false);
const deleteLoading = reactive({});

const administrationUserStore = useAdministrationUserStore();
const { ready, element: user, activeForm } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore);

const openEditForm = (item) => {
  user.value = { ...item, password: '' };
  activeForm.value = true;
};

const deleteItem = (item, force = false) => {
  deleteLoading[item.id] = true;
  administrationUserStore.deleteElement(force, item, function(data) {
    if (data.status == 'ko') {
      deleteDialog.value = true;
      element.value = { ...item, ...data.dependencies };
    } else {
      element.value = {};
      deleteDialog.value = false;
      administrationUserStore.initList();
    }
    deleteLoading[item.id] = false;
  });
};
</script>
