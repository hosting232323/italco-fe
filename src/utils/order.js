// Property icon is used in @/views/OrderStatus
const LABELS = [
  {
    value: 'New',
    title: 'Nuovo',
    icon: 'mdi-timer-sand'
  },
  {
    value: 'Confirmed',
    title: 'Confermato',
    color: 'blue',
    icon: 'mdi-progress-clock'
  },
  {
    value: 'Booking',
    title: 'A Bordo',
    color: 'blue',
    icon: 'mdi-truck-delivery'
  },
  {
    value: 'At Warehouse',
    title: 'In Magazzino',
    color: 'orange'
  },
  {
    value: 'Delivered',
    title: 'Completato',
    color: 'green',
    icon: 'mdi-check-circle-outline'
  },
  {
    value: 'Not Delivered',
    title: 'Non Completato',
    color: 'red'
  },
  {
    value: 'To Reschedule',
    title: 'Da Riprogrammare',
    color: 'orange'
  },
  {
    value: 'Redelivery',
    title: 'Riprogrammato',
    color: 'green'
  },
  { 
    value: 'REPLACEMENT',
    title: 'Sostituzione',
    color: 'purple'
  },
  { 
    value: 'CANCELLED', 
    title: 'Annullato', 
    color: 'red' 
  },
  { 
    value: 'URGENT', 
    title: 'Urgente', 
    color: 'red' 
  },
  { 
    value: 'VERIFICATION', 
    title: 'In Verifica', 
    color: 'yellow' 
  },
  { 
    value: 'CANCELLED_TO_BE_REFUNDED', 
    title: 'Annullato da rimborsare', 
    color: 'red' 
  },
  { 
    value: 'DELETED', 
    title: 'Eliminato', 
    color: 'grey' 
  }
];

const TYPES = [
  {
    title: 'Consegna',
    value: 'Delivery'
  },
  {
    title: 'Ritiro',
    value: 'Withdraw'
  },
  {
    title: 'Sostituzione',
    value: 'Replacement'
  },
  {
    title: 'Verifica',
    value: 'CHECK'
  }
];

export default {
  LABELS,
  TYPES
};
