let counter = 0;

module.exports = {
  v4: function () {
    counter++;
    return `test-uuid-${String(counter).padStart(4, '0')}-0000-0000-000000000001`;
  },
  v1: function () {
    counter++;
    return `test-uuid-${String(counter).padStart(4, '0')}-0000-0000-000000000001`;
  },
  validate: function () {
    return true;
  },
};
