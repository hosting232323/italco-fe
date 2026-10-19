<template>
  <div class="page-header">
    <div class="page-header-row">
      <h1>{{ title }}</h1>
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
