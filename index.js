const fs = require("fs");
const yaml = require("yaml");
const nunjucks = require("nunjucks");
const { execSync } = require("child_process");

const buildDir="./build/"

const referenceTypes = ["armor", "foes", "items", "potions", "shields", "weapons",
                        "ancient-whisperer-spells", "elementalist-spells", "harvester-spells",
                        "runecast-spells", "spirit-caller-spells"]
let referencesJSON = {}

// Parse the source yaml files into objects
function loadReferences() {
  for (const reference of referenceTypes) {
    const referenceData = fs.readFileSync(`./references/${reference}.yaml`, {encoding: "utf8"});
    referencesJSON[reference] = yaml.parse(referenceData);
  }
}

function makeNiceReferenceName(refName) {
  const refParts = refName.split('-');
  for (let i = 0; i < refParts.length; i++) {
    refParts[i] = refParts[i].replace(/^\w/, (c) => c.toUpperCase());
  }
  return refParts.join(' ');
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

  // Template out reference html docs
  nunjucks.configure('views');
  const referenceTemplate = 'reference.njk'
  for (const reference of referenceTypes) {
    const context = { "referenceName": makeNiceReferenceName(reference) }
    const referenceHtmlFile = buildDir + reference + ".html";
    fs.writeFile(referenceHtmlFile, nunjucks.render(referenceTemplate, context), (err) => {
      if (err) {
        console.log(`ERROR: Unable to template reference html file for reference ${reference}`);
        process.exit(1);
      }
    });
  }

  // Copying static files is done from package.json build definition
}
