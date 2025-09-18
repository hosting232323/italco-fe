<template>
  <v-container fluid class="background">
    <p class="title-error-page" :style="{ color: theme.current.value.primaryColor }">404</p>
    <p class="subtitle">Oops! Pagina non trovata</p>
    <p class="description">La pagina che stai cercando non esiste o è stata spostata.</p>
    <a href="/dashboard" class="home" :style="{ color: theme.current.value.primaryColor }">Torna alla Dashboard</a>
  </v-container>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();
</script>

<style scoped>
.background {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.title-error-page {
  font-size: 170px;
  text-transform: uppercase;
  font-weight: 700;
  font-style: normal;
  letter-spacing: 5px;
}

.subtitle {
  font-size: 23px;
  color: #000;
  font-weight: bold;
}

.description {
  font-size: 20px;
  color: #000;
  margin: 10px 0;
}

.home {
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  position: relative;
  display: inline-block;
}

.home::after {
  content: '';
  position: absolute;
  left: 0%;
  bottom: -2px;
  width: 50%;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease, left 0.3s ease;
}

.home:hover::after {
  width: 100%;
  left: 0;
  transform: none;
}



@media (max-width: 599px) {
  .title-error-page {
    letter-spacing: 4px;
    font-size: 150px;
  }

  .subtitle {
    font-size: 20px;
  }

  .description {
    font-size: 17px;
  }
}
</style>
