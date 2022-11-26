const fs = require("fs");
const yaml = require("yaml");
const nunjucks = require("nunjucks");
const { execSync } = require("child_process");

const buildDir="./build/";

const referenceDescriptions = {
  "armor": "A searchable list of armor in TitanMage TTRPG.",
  "foes": "",
  "items": "A searchable list of items in TitanMage TTRPG.",
  "potions": "A searchable list of potions in TitanMage TTRPG.",
  "shields": "A searchable list of shields in TitanMage TTRPG.",
  "weapons": "A searchable list of weapons in TitanMage TTRPG.",
  "ancient-whisperer-spells": "A searchable list of spells for the Ancient Whisperer magic system in TitanMage TTRPG.",
  "elementalist-spells": "A searchable list of spells for the Elementalist magic system in TitanMage TTRPG.",
  "harvester-spells": "A searchable list of spells for the Harvester magic system in TitanMage TTRPG.",
  "runecast-spells": "A searchable list of spells for the Runecast magic system in TitanMage TTRPG.",
  "spirit-caller-spells": "A searchable list of spells for the Spirit Caller magic system in TitanMage TTRPG."
};

const referenceTypes = Object.keys(referenceDescriptions);
const customReferenceTypes = ["foes"];

var referencesJSON = {};

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
    execSync("emacs -Q --script elisp/init.el");
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
  const referenceTemplate = 'reference.njk';
  for (const reference of referenceTypes) {
    if (!customReferenceTypes.includes(reference)) {
      const context = { "referenceName": makeNiceReferenceName(reference),
                        "description": referenceDescriptions[reference] };
      const referenceHtmlFile = buildDir + reference + ".html";
      fs.writeFile(referenceHtmlFile, nunjucks.render(referenceTemplate, context), (err) => {
        if (err) {
          console.log(`ERROR: Unable to template reference html file for reference ${reference}`);
          process.exit(1);
        }
      });
    }
  }

  // Copying static files is done from package.json build definition
}
