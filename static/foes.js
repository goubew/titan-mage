function capitalize(str) {
  return str.replace(/^\w/, (c) => c.toUpperCase());
}

function nameToId(name) {
  return name.toLowerCase().replace(/\s/g, '-');
}

function getSortedFoeTypes(foes) {
  var foeTypes = [];
  foes.forEach((foe) => {
    if (!foeTypes.includes(foe.classifier)) {
      foeTypes.push(foe.classifier);
    }
  });

  return foeTypes.sort();
}

function getSortedFoesByType(foes) {
  var foeByType = {};
  foes.forEach((foe) => {
    if (foe.classifier in foeByType) {
      foeByType[foe.classifier].push(foe.name);
    } else {
      foeByType[foe.classifier] = [foe.name];
    }
  });

  for (var foeType in foeByType) {
    foeByType[foeType] = foeByType[foeType].sort();
  }

  return foeByType;
}

function foeTypeFilter(foeType, foes) {
  var objHTML = [`
<hr>
<h5>${capitalize(foeType)}</h5>
`];
  foes.forEach((foe) => {
    const foeId = nameToId(foe);
    objHTML.push(`
<div>
<input type="checkbox" name="${foeId}" id="checkbox-${foeId}" class="checkbox-filter"><label for="checkbox-${foeId}">${foe}</label>
</div>
`);
  });
  return objHTML.join("");
}

function foeToHTML(foe) {
  var objHTML = [`
<div class="reference" id="${nameToId(foe.name)}">
  <hr>
  <p class="bigp"><span class="foe-name"><b>${foe.name}</b></span> - <em>${foe.size} ${foe.classifier}</em> - ${foe.difficulty}</p>
  <div class="stats">
  <p><b>POWER</b><br>${foe.mainStats.power}</p>
  <p><b>REFLEX</b><br>${foe.mainStats.reflex}</p>
  <p><b>PRESENCE</b><br>${foe.mainStats.presence}</p>
  <p><b>FOCUS</b><br>${foe.mainStats.focus}</p>
  </div>
  <div class="stats">`];

  if (foe.auxStats.maxHp > 0) {
    objHTML.push(`<p><b>MAX HP</b><br>${foe.auxStats.maxHp}</p>`);
  }
  if (foe.auxStats.maxMp > 0) {
    objHTML.push(`<p><b>MAX MP</b><br>${foe.auxStats.maxMp}</p>`);
  }
  if (foe.auxStats.movSpd > 0) {
    objHTML.push(`<p><b>MOV SPD</b><br>${foe.auxStats.movSpd}</p>`);
  }
  if (foe.auxStats.defThr > 0) {
    objHTML.push(`<p><b>DEF THR</b><br>${foe.auxStats.defThr}</p>`);
  }
  if (foe.auxStats.def > 0) {
    objHTML.push(`<p><b>DEF</b><br>${foe.auxStats.def}</p>`);
  }
  if (foe.auxStats.magRes > 0) {
    objHTML.push(`<p><b>MAG RES</b><br>${foe.auxStats.magRes}</p>`);
  }
  objHTML.push("</div>");
  if (foe.abilities.length > 0) {
    objHTML.push("<p><b>Abilities</b>:</p><ul>");
    foe.abilities.forEach((ability) => {
      objHTML.push(`<li><b>${ability.name}</b>: ${ability.effect}</li>`);
    });
    objHTML.push("</ul>");
  }
  if (foe.majorActions.length > 0) {
    objHTML.push("<p><b>Major Actions</b>:</p><ul>");
    foe.majorActions.forEach((action) => {
      objHTML.push(`<li><b>${action.name}</b>: ${action.action}</li>`);
    });
    objHTML.push("</ul>");
  }
  if (foe.minorActions.length > 0) {
    objHTML.push("<p><b>Minor Actions</b>:</p><ul>");
    foe.minorActions.forEach((action) => {
      objHTML.push(`<li><b>${action.name}</b>: ${action.action}</li>`);
    });
    objHTML.push("</ul>");
  }

  objHTML.push("</div>");
  return objHTML.join("");
}

function showFilterList() {
  document.querySelector('#foe-content-div').style.display = 'none';
  document.querySelector('#filter-div').style.display = 'block';
}

function hideFilterList() {
  document.querySelector('#foe-content-div').style.display = null;
  document.querySelector('#filter-div').style.display = 'none';
}

function applyFilterList() {
  document.querySelectorAll('.checkbox-filter').forEach((checkbox) => {
    const foeId = `#${checkbox.name}`
    const foeDiv = document.querySelector(foeId);
    if (checkbox.checked) {
      console.log(`Showing element ${foeId}`);
      foeDiv.style.display = null;
    } else {
      // TODO hide does not seem to be working
      console.log(`Hiding element ${foeId}`);
      foeDiv.style.display = 'none';
    }
  });
  hideFilterList();
}

function resetFoes() {
  document.querySelectorAll('.reference').forEach((reference) => {
    reference.style.display = null;
  });
}

async function loadFoesJson() {
  const response = await fetch("./foes.json");

  if (!response.ok) {
    console.log("Failed to load foe JSON");
    return {};
  }

  const foesJson = await response.json();
  var sortedFoeTypes = getSortedFoeTypes(foesJson);
  var sortedFoesByType = getSortedFoesByType(foesJson);
  var referenceHTML = [];

  sortedFoeTypes.forEach((foeType) => {
    referenceHTML.push(foeTypeFilter(foeType, sortedFoesByType[foeType]));
  });
  document.querySelector('#filter-list-div').innerHTML = referenceHTML.join("");

  var referenceHTML = [];
  foesJson.forEach((foe) => {
    referenceHTML.push(foeToHTML(foe));
  });
  document.querySelector('.json-content').innerHTML = referenceHTML.join("");

  document.querySelector('#filter-button').addEventListener("click", showFilterList);
  document.querySelector('#reset-button').addEventListener("click", resetFoes);
  document.querySelector('#apply-button').addEventListener("click", applyFilterList);
  document.querySelector('#cancel-button').addEventListener("click", hideFilterList);
}

document.addEventListener("DOMContentLoaded", loadFoesJson);
