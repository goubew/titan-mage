const fs = require("fs");
const yaml = require("yaml");
const { exec } = require("child_process");

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
  // Translate the org files to html
  console.log("-------------- [ Emacs Publishing ] --------------");
  exec("emacs -Q --script init.el", (err, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    console.log("------------ [ End Emacs Publishing ] ------------");
    if (err) {
      console.log("ERROR: Emacs publishing failed.");
      process.exit(1);
    }
  });

  // Write the reference files to json
}
