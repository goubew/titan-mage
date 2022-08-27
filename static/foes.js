function foeToHTML(foe) {
  var objHTML = [`
<div class="reference">
  <hr>
  <p><b>${foe.name}</b></p>
  <p><em>${foe.size} ${foe.classifier}</em></p>
  <div class="stats">
  <p><b>POWER</b><br>${foe.mainStats.power}</p>
  <p><b>REFLEX</b><br>${foe.mainStats.reflex}</p>
  <p><b>PRESENCE</b><br>${foe.mainStats.presence}</p>
  <p><b>FOCUS</b><br>${foe.mainStats.focus}</p>
  </div>
  <div class="stats stats-end">`];

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

$.getJSON("./foes.json", (foes) => {
  var referenceHTML = [];
  foes.forEach((foe) => {
    referenceHTML.push(foeToHTML(foe));
  });
  $('.json-content').append(referenceHTML.join(""));
});
