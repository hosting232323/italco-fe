import { ref, onMounted, onBeforeUnmount } from 'vue';


const isMobile = ref(false);


const checkMobile = () => {
  isMobile.value = window.innerWidth < 600;
};


const setupMobileUtils = () => {
  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile);
  });
  return isMobile;
};


export default {
  setupMobileUtils
};
