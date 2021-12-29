const fs = require("fs");
const yaml = require("yaml");
const { execSync } = require("child_process");

const buildDir="./build/"

const referenceTypes = ["armor", "foes", "items", "potions", "spells", "weapons"]
let referencesJSON = {}

// Parse the source yaml files into objects
function loadReferences() {
  for (const reference of referenceTypes) {
    const referenceData = fs.readFileSync(`./references/${reference}.yaml`, {encoding: "utf8"});
    referencesJSON[reference] = yaml.parse(referenceData);
  }
}

module.exports = { referencesJSON, referenceTypes, loadReferences };

if (require.main === module) {
  // Translate the org files to html
  console.log("-------------- [ Emacs Publishing ] --------------");
  try {
    execSync("emacs -Q --script init.el");
  } catch (e) {
    console.log("ERROR: Emacs publishing failed.");
    process.exit(1);
  }
  console.log("------------ [ End Emacs Publishing ] ------------");

  // Write the reference files to json
  loadReferences();
  for (const reference of referenceTypes) {
    const referenceFile = buildDir + reference + ".json";
    fs.writeFile(referenceFile, JSON.stringify(referencesJSON[reference]), (err) => {
      if (err) {
        console.log(`ERROR: Unable to stringify the ${reference} JSON file.`);
        process.exit(1);
      }
    });
  }

  // Copying static files is done from package.json build definition
}
