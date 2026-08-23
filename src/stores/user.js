import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    userId: 0,
    token: '',
    // Company su cui si sta operando. Per tutti i ruoli tranne il super admin è
    // la propria e non cambia mai; il super admin parte senza e la sceglie.
    company: null
  }),
  persist: true
});
