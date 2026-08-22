import { useUserStore } from '@/stores/user';


// Modulo RAEE dell'attività su cui si sta operando.
// Gli store RAEE lo interrogano prima di chiamare il backend: con il modulo
// spento quegli endpoint rispondono ko, e una setList su quella risposta
// lascerebbe la lista undefined marcandola comunque pronta.
const isEnabled = () => !!useUserStore().company?.rae;


export default {
  isEnabled
};
