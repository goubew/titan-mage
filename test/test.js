const assert = require("assert");
const { schemas } = require("../index.js");

describe("References match the schemas", function() {
  for (const schema in schemas) {
    it(`${schema} matches its schema`, function() {
    });
  }
});
