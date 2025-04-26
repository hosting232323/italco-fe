<template>
  <v-row no-gutters>
    <v-col cols="10">
      <v-btn
        class="mt-1"
        type="submit"
        text="Invia"
        block
        :loading="loading"
        :color="theme.current.value.primaryColor"
      />
    </v-col>
    <v-spacer />
    <v-col cols="1">
      <v-btn
        variant="text"
        icon="mdi-close"
        block
        :loading="loading"
        :color="theme.current.value.primaryColor"
        @click="emits('cancel')"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const emits = defineEmits(['cancel']);

const theme = useTheme();
const loading = ref(false);
</script>
