const referenceType = window.location.pathname.match(/\/(.*)\.html/)[1];

function capitalize(str) {
  return str.trim().replace(/^\w/, (c) => c.toUpperCase());
}

function makePretty(key) {
  if (key == "mp" || key == "hp") {
    return key.toUpperCase();
  }
  return capitalize(key);
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
      objHTML += `<p style="margin-left: ${pmargin}em;"><b>${prettyKey}</b>:</p>`;
      console.log("TODO: implement array output");
    } else {
      console.log(`Could not convert ${val} to reference HTML`);
    }
  });
  objHTML += "</div>";
  return objHTML;
}

$.getJSON(`./${referenceType}.json`, (referenes) => {
  var referenceHTML = "";
  referenes.forEach((reference) => {
    referenceHTML += objToHTML(reference);
  });
  $('.json-content').append(referenceHTML);
});
