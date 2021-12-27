const assert = require("assert");
const fs = require("fs");
const Ajv = require("ajv");
const ajv = new Ajv();

let { references, referenceTypes, loadReferences } = require("../index.js");

describe("References match the schemas", () => {
  it("Can convert the reference files from yaml to json", () => { loadReferences() });

  for (const reference of referenceTypes) {
    it(`${reference} matches its schema`, () => {
      const referenceData = references[reference];
      assert(referenceData, JSON.stringify(referenceData));

      const schema = JSON.parse(fs.readFileSync(`./references/${reference}-schema.json`, {encoding: "utf8"}));
      const validate = ajv.compile(schema);
      const validateResult = validate(references[reference]);
      assert(validateResult, JSON.stringify(validate.errors));
    });
  }
});
