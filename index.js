const fs = require("fs");
const yaml = require("yaml");

const referenceTypes = ["armor", "foes", "items", "spells", "weapons"]
let references = {}

// Parse the yaml files into json
function loadReferences() {
  for (const reference of referenceTypes) {
    const referenceData = fs.readFileSync(`./references/${reference}.yaml`, {encoding: "utf8"});
    references[reference] = yaml.parse(referenceData);
  }
}

module.exports = { references, referenceTypes, loadReferences };

if (require.main === module) {
  //Do the stuff
}
