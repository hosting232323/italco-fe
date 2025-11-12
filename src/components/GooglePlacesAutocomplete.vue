<template>
  <v-text-field
    :id="inputId"
    v-model="localValue"
    :label="label"
    :class="customClass"
    :rules="computedRules"
    clearable
    @input="isValidAddress = false"
  />
</template>

<script setup>
/* global google */

import { ref, onMounted, nextTick, computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  label: {
    type: String,
    required: true
  },
  rules: {
    type: Array,
    required: true
  },
  customClass: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['addressComponents']);

const isValidAddress = ref(true);
const localValue = ref(props.modelValue);
const inputId = `google-autocomplete-${Math.random().toString(36).substr(2, 9)}`;

const computedRules = computed(() => [
  ...(props.rules || []),
  () => isValidAddress.value || 'Seleziona un indirizzo valido da Google Places'
]);

onMounted(async () => {
  while (!window.google?.maps?.places)
    await new Promise((resolve) => setTimeout(resolve, 100));

  await nextTick();
  const inputElement = document.getElementById(inputId);
  if (!inputElement) return;

  const autocompleteInstance = new google.maps.places.Autocomplete(inputElement, {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'it' },
    fields: ['geometry', 'formatted_address', 'name', 'address_components']
  });

  autocompleteInstance.addListener('place_changed', async () => {
    const place = autocompleteInstance.getPlace();
    if (place.geometry && place.formatted_address) {
      localValue.value = place.name
        ? `${place.name}, ${place.formatted_address}`
        : place.formatted_address;

      isValidAddress.value = true;
      let cap = '';
      let address = '';
      const parts = [];
      place.address_components.forEach((component) => {
        if (component.types.includes('route')) parts.push(component.long_name);
        if (component.types.includes('street_number')) parts.push(component.long_name);
        if (component.types.includes('locality')) parts.push(component.long_name);
        if (component.types.includes('administrative_area_level_2')) parts.push(component.short_name);
        if (component.types.includes('postal_code')) cap = component.long_name;
      });
      address = parts.join(', ');

      if (!cap && place.geometry?.location) {
        const postalComponent = (await new Promise((resolve, reject) => {
          new google.maps.Geocoder().geocode(
            { location: place.geometry.location },
            (res, status) => {
              if (status === 'OK' && res && res.length > 0) resolve(res);
              else reject(status);
            }
          );
        }))[0].address_components.find((c) =>
          c.types.includes('postal_code')
        );
        if (postalComponent) cap = postalComponent.long_name;
      }

      emit('addressComponents', { address, cap });
    }
  });
});
</script>
