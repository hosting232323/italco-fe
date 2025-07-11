import { useUserStore } from '@/stores/user';

const logout = (router) => {
  const userStore = useUserStore();
  userStore.logout();
  router.push('/');
};

export default {
  logout
};
