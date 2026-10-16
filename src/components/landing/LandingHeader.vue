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

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: linear-gradient(var(--paper) 55%,#fafafae8 80%,#fafafa00);
  padding: 26px 0 32px;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.brand {
  color: var(--blue);
  font-weight: 800;
  font-size: 28px;
  letter-spacing: -1.4px;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 25px;
}
.menu-button {
  background: none;
  border: 0;
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 12px 0;
  font-size: 14px;
}
.hamb {
  width: 16px;
  display: grid;
  gap: 4px;
}
.hamb i {
  height: 1px;
  background: currentColor;
}
@media (max-width: 650px) {
  .header {
    padding: 20px 0 25px;
  }
  .brand {
    font-size: 23px;
  }
  .nav-right {
    gap: 14px;
  }
  .menu-button {
    font-size: 0;
    gap: 0;
    padding: 12px 4px;
  }
  .nav .button {
    padding: 12px 15px;
    font-size: 12px;
    min-height: 42px;
    border-radius: 8px;
  }
}
</style>
