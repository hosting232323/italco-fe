import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    role: '',
    userId: 0,
    token: ''
  }),
  // L'access token vive solo in memoria: al reload viene riottenuto dal
  // refresh token (cookie HttpOnly). Persistiamo solo role/userId per la UI.
  persist: {
    paths: ['role', 'userId']
  }
});
