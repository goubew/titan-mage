const ajv = require("ajv");
const yaml = require("yaml");

const schemas = ["armor", "foes", "items", "spells", "weapons"]

module.exports = { schemas };

if (require.main === module) {
  //Do the stuff
}
