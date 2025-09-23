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
        :disabled="loading"
        :color="theme.current.value.primaryColor"
        @click="emits('cancel')"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { useTheme } from 'vuetify';

const { loading } = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
});

const emits = defineEmits(['cancel']);
const theme = useTheme();
</script>
