<template>

</template>

<script setup>
import http from '@/utils/http';
import { useRouter } from 'vue-router';

const router = useRouter();

http.getRequest('log', {}, (data) => {
  console.log(data);
}, 'GET', router)
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}

.blur-password {
  filter: blur(6px);
}
</style>
