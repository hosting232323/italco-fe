const positiveNumberRules = [
  (value) => {
    if (value === null || value === undefined || value === '') return true;
    if (!isNaN(value) && Number(value) >= 0) return true;
    return 'Deve essere un numero positivo';
  }
]
;
const requiredRules = [
  (value) => {
    if (value) return true;
    return 'Campo obbligatorio';
  }
];

const arrayRules = [
  (value) => {
    if (value.length > 0) return true;
    return 'Campo obbligatorio';
  }
];

const capRules = [
  ...requiredRules,
  (value) => {
    if (value && value.length === 5) return true;
    return 'Il CAP deve essere di 5 caratteri';
  }
];

const phoneRules = [
  (value) => {
    if (!value || /^\+39\d{10}$/.test(value)) return true;
    return 'Il numero di telefono deve essere nel formato +39XXXXXXXXXX';
  }
];

const futureTime = (element) => [
  ...requiredRules,
  (value) => {
    if (!value || !element) return true;

    const [startH, startM] = element.split(':').map(Number);
    const [endH, endM] = value.split(':').map(Number);
    return endH * 60 + endM > startH * 60 + startM
      ? true
      : 'L\'orario di fine deve essere maggiore di quello di inizio';
  }
];

const futureDate = (element) => [
  (value) => {
    if (value && !element)
      return 'Inserisci prima la data iniziale';

    return new Date(value) > new Date(element)
      ? true
      : 'La data deve essere successiva a quella iniziale';
  }
];

const minGroupSizeRule = (maxElement) => [
  (value) => {
    if (value === null || value === undefined || value === '') return true;
    if (maxElement === null || maxElement === undefined || maxElement === '') return true;

    return Number(value) <= Number(maxElement) || 
      'La dimensione minima del gruppo non può essere maggiore della massima';
  }
];

const maxGroupSizeRule = (minElement) => [
  (value) => {
    if (value === null || value === undefined || value === '') return true;
    if (minElement === null || minElement === undefined || minElement === '') return true;

    return Number(value) >= Number(minElement) || 
      'La dimensione massima del gruppo non può essere minore della minima';
  }
];

export default {
  positiveNumberRules,
  requiredRules,
  arrayRules,
  capRules,
  phoneRules,
  futureTime,
  futureDate,
  minGroupSizeRule,
  maxGroupSizeRule
};
