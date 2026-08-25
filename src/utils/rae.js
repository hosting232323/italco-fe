import { useUserStore } from '@/stores/user';


// Modulo RAEE dell'attività su cui si sta operando.
// Gli store RAEE lo interrogano prima di chiamare il backend: con il modulo
// spento quegli endpoint rispondono ko, e una setList su quella risposta
// lascerebbe la lista undefined marcandola comunque pronta.
const isEnabled = () => !!useUserStore().company?.rae;


// Durante la clonazione gli elementi non RAEE restano sempre disponibili;
// quelli RAEE annullati si possono rigenerare solo se il modulo è ancora acceso.
const filterCloneProducts = (products) => {
  const enabled = isEnabled();
  return Object.fromEntries(
    Object.entries(products).filter(
      ([, product]) => !product.rae_product || (enabled && product.rae_product.status === 'Annulled')
    )
  );
};


export default {
  isEnabled,
  filterCloneProducts
};
