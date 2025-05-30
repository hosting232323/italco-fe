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

export default {
  requiredRules,
  arrayRules
};
