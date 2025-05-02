const requiredRules = [
  (value) => {
    if (value) return true;
    return 'Campo obbligatorio';
  }
];

export default {
  requiredRules
};
