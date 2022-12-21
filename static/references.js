const referenceType = window.location.pathname.match(/\/(.*)\.html(\?.*)?/)[1];
const prettyMap = {
  mp: "MP",
  hp: "HP",
  majStats: "Major Stats",
  auxStats: "Auxiliary Stats",
}
let searchQuery = new RegExp('.*', 'i');
let rawReferences = [];

function uncamelcase(str) {
  // Put spaces in front of capitals
  str = str.replace(/([A-Z])/g, ' $1').trim()
  // Capitalize the first letter
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

function makePretty(key) {
  if (key in prettyMap) {
    return prettyMap[key];
  }
  return uncamelcase(key);
}

function isArray(obj) {
  return (typeof(obj) == "object" && Array.isArray(obj));
}

function isNestedObj(obj) {
  return (typeof(obj) == "object" && ! Array.isArray(obj));
}

function isPrimitive(obj) {
  return ["boolean", "number", "bigint", "string"].includes(typeof(obj));
}

function objToHTML(obj, pmargin=0, hr=true) {
  if (!searchQuery.test(obj.name)) {
    return "";
  }
  var objHTML = "<div class=\"reference\">";
  if (hr) { objHTML += "<hr>"; }
  Object.keys(obj).forEach((key) => {
    const prettyKey = makePretty(key);
    const val = obj[key];

    if (isPrimitive(val)) {
      objHTML += `<p style="margin-left: ${pmargin}em;"><b>${prettyKey}</b>: ${val}</p>`;
    } else if (isNestedObj(val)){
      objHTML += `<p style="margin-left: ${pmargin}em;"><b>${prettyKey}</b>:</p>`;
      objHTML += objToHTML(val, pmargin + 1, false);
    } else if (isArray(val)) {
      if (val.length == 0) {
        objHTML += `<p style="margin-left: ${pmargin}em;"><b>${prettyKey}</b>: None</p>`;
      } else {
        objHTML += `<p style="margin-left: ${pmargin}em;"><b>${prettyKey}</b>:</p><ul style="margin-left: ${pmargin}em;">`;
        val.forEach((arrVal) => {
          if (isPrimitive(arrVal)) {
            objHTML += `<li><p>${arrVal}</p></li>`;
          } else {
            objHTML += "<li>";
            objHTML += objToHTML(arrVal, 0, false);
            objHTML += "</li>";
          }
        });
        objHTML += "</ul>";
      }
    } else {
      console.log(`Could not convert ${val} to reference HTML`);
    }
  });
  objHTML += "</div>";
  return objHTML;
}

function reloadJson() {
  let referenceHTML = "";
  rawReferences.forEach((reference) => {
    referenceHTML += objToHTML(reference);
  });
  document.querySelector('.json-content').innerHTML = referenceHTML;
}

async function loadReferences() {
  const response = await fetch(`./${referenceType}.json`);

  if (!response.ok) {
    console.log("Failed to load foe JSON");
    return {};
  }

  const responseJson = await response.json();
  responseJson.forEach((reference) => {
    rawReferences.push(reference);
  });
  reloadJson();

  document.querySelector('#search-button').addEventListener("click", () => {
    searchQuery = new RegExp(document.querySelector('#search-field').value, 'i');
    reloadJson();
  });

  document.querySelector('#search-clear-button').addEventListener("click", () => {
    document.querySelector('#search-field').value = "";
    searchQuery = new RegExp('.*', 'i');
    reloadJson();
  });
}

document.addEventListener("DOMContentLoaded", loadReferences);
