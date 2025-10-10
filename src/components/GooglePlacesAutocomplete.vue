<template>
  <v-text-field
    :id="inputId"
    v-model="localValue"
    :label="label"
    :class="customClass"
    :rules="computedRules"
    clearable
    @input="handleInput"
  />
</template>

<script setup>
/* global google */

import {
  ref,
  watch,
  onMounted,
  nextTick,
  computed,
} from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
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

const emit = defineEmits(['update:isValid', 'addressComponents']);
const localValue = ref(props.modelValue);
const inputId = ref(
  `google-autocomplete-${Math.random().toString(36).substr(2, 9)}`
);
let autocompleteInstance = null;
const isValidAddress = ref(true);

const handleInput = () => {
  isValidAddress.value = false;
  emit('update:isValid', false);
};

const initAutocomplete = async () => {
  while (!window.google?.maps?.places) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  await nextTick();
  const inputElement = document.getElementById(inputId.value);
  if (!inputElement) return;

  autocompleteInstance = new google.maps.places.Autocomplete(inputElement, {
    types: ['establishment', 'geocode'],
    componentRestrictions: { country: 'it' },
    fields: ['geometry', 'formatted_address', 'name', 'address_components'],
  });

  autocompleteInstance.addListener('place_changed', async () => {
    const place = autocompleteInstance.getPlace();

    if (place.geometry && place.formatted_address) {
      const placeName = place.name || '';
      localValue.value = placeName
        ? `${placeName}, ${place.formatted_address}`
        : place.formatted_address;

      isValidAddress.value = true;
      emit('update:isValid', true);

      const addressComponents = {
        address: '',
        cap: ''
      };

      let route = '';
      let streetNumber = '';
      let city = '';
      let province = '';

      place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes('route')) route = component.long_name;
        if (types.includes('street_number')) streetNumber = component.long_name;
        if (types.includes('locality')) city = component.long_name;
        if (types.includes('postal_code')) addressComponents.cap = component.long_name;
        if (types.includes('administrative_area_level_2')) province = component.short_name;
      });

      const parts = [];
      if (route) parts.push(route);
      if (streetNumber) parts.push(streetNumber);
      if (city) parts.push(city);
      if (province) parts.push(province);

      addressComponents.address = parts.join(', ');

      if (!addressComponents.cap && place.geometry?.location) {
        const geocoder = new google.maps.Geocoder();
        const results = await new Promise((resolve, reject) => {
          geocoder.geocode(
            { location: place.geometry.location },
            (res, status) => {
              if (status === 'OK' && res && res.length > 0) resolve(res);
              else reject(status);
            }
          );
        });

        const postalComponent = results[0].address_components.find((c) =>
          c.types.includes('postal_code')
        );
        if (postalComponent) {
          addressComponents.cap = postalComponent.long_name;
        }
      }

      emit('addressComponents', addressComponents);
    }
  });
};

onMounted(() => {
  initAutocomplete();
});

watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal;
  }
);

const computedRules = computed(() => [
  ...(props.rules || []),
  () => isValidAddress.value || 'Seleziona un indirizzo valido da Google Places'
]);
</script>
