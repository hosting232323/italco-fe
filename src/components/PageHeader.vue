<template>
  <div class="page-header">
    <div class="page-header-row">
      <component :is="level">
        {{ title }}
        <slot name="title-extra" />
      </component>
      <div class="page-header-actions">
        <slot />
      </div>
    </div>
    <hr>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  // Intestazione di sezione dentro una pagina: h2 al posto dell'h1 del titolo pagina.
  level: {
    type: String,
    default: 'h1'
  }
});
</script>

<style scoped>
.page-header-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px 16px;
}

.page-header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
</style>
