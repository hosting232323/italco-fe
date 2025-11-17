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
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return endMinutes > startMinutes ? true : 'L\'orario di fine deve essere maggiore di quello di inizio';
  }
];

export default {
  positiveNumberRules,
  requiredRules,
  arrayRules,
  capRules,
  phoneRules,
  futureTime
};
