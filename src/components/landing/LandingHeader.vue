<template>
  <header class="header">
    <div class="container nav">
      <a
        href="#inizio"
        class="brand"
        aria-label="HUBSTRA, home"
      >HUBSTRA</a>
      <div class="nav-right">
        <button
          class="menu-button"
          aria-haspopup="dialog"
          aria-controls="menu"
          @click="emit('open-menu')"
        >
          <span
            class="hamb"
            aria-hidden="true"
          >
            <i />
            <i />
          </span>Menu
        </button>
        <router-link
          class="button outline"
          to="/login"
        >
          Accedi
        </router-link>
        <button
          class="button"
          @click="emit('open-demo')"
        >
          Richiedi una demo
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const emit = defineEmits(['open-menu', 'open-demo']);
</script>
