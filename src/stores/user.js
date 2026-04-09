import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    userId: 0,
    token: '',
    company: {}
  }),
  persist: true
});
