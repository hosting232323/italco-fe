<template>
  <v-dialog max-width="1500" v-model="dialog">
    <template v-slot:activator>
      <v-data-table
        :items="users"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="[
          { title: 'ID', value: 'id' },
          { title: 'Nickname', value: 'email' },
          { title: 'Password', value: 'password' },
          { title: 'Ruolo', value: 'role' },
          { title: 'Azioni', key: 'actions' }
        ]"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            v-if="item.role !== 'Admin'"
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </template>
      </v-data-table>
    </template>
    <template v-slot:default>
      <v-card title="Attenzione!" :text="message">
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
            @click="deleteItem(element, true)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const element = ref({});
const message = ref('');
const theme = useTheme();
const dialog = ref(false);
const router = useRouter();
const administrationUserStore = useAdministrationUserStore();
const users = storesUtils.getStoreList(administrationUserStore, router);

const deleteItem = (item, force = false) => {
  administrationUserStore.deleteElement(force, item, router, function(data) {
    if (data.status == 'ko') {
      dialog.value = true;
      element.value = item;
      message.value = data.error;
    } else {
      message.value = '';
      element.value = {};
      dialog.value = false;
      administrationUserStore.initList(router);
    }
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
