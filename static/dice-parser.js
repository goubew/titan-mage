function countChars(searchStr, searchChar) {
  let count = 0;
  for (let i = 0; i < searchStr.length; i++) {
    if (searchStr[i] == searchChar) count++;
  }

  return count;
}

function usesValidDiceNums(equation) {
  const validDiceNums = ['4', '6', '8', '10', '12', '20'];
  const diceRe = /d([0-9]+)/g;

  for (const match in equation.matchAll(diceRe)) {
    if (!validDiceNums.includes(match[1])) return false;
  }

  const invalidDiceRe = /d[^0-9]/;
  if (invalidDiceRe.test(equation)) return false;
  if (equation.endsWith('d')) return false;

  return true;
}

function usesValidCharacters(equation) {
  const invalidCharRe = /[^0-9d~(),+-]/;
  return !invalidCharRe.test(equation);
}

function isValidSingleDice(term) {
  const singleDiceRe = /^d(?:4|6|8|10|12|20)$/;
  return singleDiceRe.test(term);
}

function isValidDiceProduct(term) {
  const diceProductRe = /^([1-9][0-9]*)?d(4|6|8|10|12|20)$/;
  return term.match(diceProductRe);
}

function isValidTildeTerm(term) {
  const tildeCount = countChars(term, '~');

  if (tildeCount > 1) return false;
  if (!term.startsWith('~')) return false;
  if (term.length < 4) return false; 
  if (countChars(term, '(') != 1) return false;
  if (countChars(term, ')') != 1) return false;
  if (term[1] != '(') return false;
  if (term[term.length - 1] != ')') return false;

  term = term.substring(2, term.length - 1);
  const commaCount = countChars(term, ',');
  if (commaCount > 0) {
    if (commaCount > 1) return false;
    const tildeArgs = term.split(',');
    const tildeArgsValid = tildeArgs.every((arg) => {
      return isValidSingleDice(arg)
    });
    if (!tildeArgsValid) return false;
  } else {
    if (term[0] != '2') return false;
    if (!isValidDiceProduct(term)) return false;
  }
  return true;
}

function isValidTerm(term) {
  const hyphenCount = countChars(term, '-');
  if (hyphenCount > 0) {
    if (hyphenCount > 1) return false;
    if (!term.startsWith('-')) return false;

    term = term.substring(1);
  }

  if (term.includes('~')) {
    if (!isValidTildeTerm(term)) return false;
  } else if (term.includes('d')) {
    if (!isValidDiceProduct(term)) return false;
  } else {
    const numRegex = /[0-9]+/;
    if (!numRegex.test(term)) return false;
  }

  return true;
}

function isValidDiceEquation(equation) {
  if (!usesValidCharacters(equation)) return false;
  if (!usesValidDiceNums(equation)) return false;

  const terms = equation.split('+');
  return terms.every((term) => {
    return isValidTerm(term)
  });
}

function normalizeDiceEquation(equation) {
  equation = equation.toLowerCase();
  equation = equation.replace(/\s/g, '');
  equation = equation.replace('-', '+-');
  return equation;
}

function evaluateTildeExpression(term) {
  let negate = false;
  if (term.startsWith('-')) {
    negate = true;
    term = term.substring(1);
  }

  const sameDiceRe = /2d([0-9]+)/
  const sameDiceMatch = term.match(sameDiceRe);
  if (sameDiceMatch != null) term = term.replace(sameDiceRe, `d${sameDiceMatch[1]},d${sameDiceMatch[1]}`);

  term = term.substring(2, term.length - 1);

  const diceTypes = term.split(',');
  const dice1Result = newDice(diceTypes[0]);
  const dice2Result = newDice(diceTypes[1]);

  let diceDiff = dice1Result.roll > dice2Result.roll ? (dice1Result.roll - dice2Result.roll) : (dice2Result.roll - dice1Result.roll);
  const diceBodies = [dice1Result.diceBody, dice2Result.diceBody]; 

  if (negate) diceDiff = -diceDiff;

  return {
    value: diceDiff,
    dice: diceBodies
  }
}

function evaluateDiceExpression(term) {
  let negate = false;
  if (term.startsWith('-')) {
    negate = true;
    term = term.substring(1);
  }

  const diceParts = term.split('d');
  let diceMultiple = 1;
  if (diceParts[0] != "") diceMultiple = diceParts[0];
  const diceType = `d${diceParts[1]}`;

  let diceSum = 0;
  const diceBodies = []

  for (let i = 0; i < diceMultiple; i++) {
    const diceResult = newDice(diceType);
    diceSum += diceResult.roll;
    diceBodies.push(diceResult.diceBody);
  }

  if (negate) diceSum = -diceSum;

  return {
    value: diceSum,
    dice: diceBodies
  }
}

function evaluateConstantExpression(term) {
  return {
    value: parseInt(term, 10),
    dice: []
  }
}

/* Returns an object
   {
   "value": <- The result of executing the equation with random dice values
   "dice": <- Array of Matter.js bodies for the extracted dice
   }

   or null if the equation is not valid
 */
function extractEquationDice(equation) {
  equation = normalizeDiceEquation(equation);

  if (!isValidDiceEquation(equation)) {
    console.log(`The equation ${equation} is not valid.`)
    return null;
  }

  let diceBodies = [];
  let rollingResult = 0;

  const expressionTerms = equation.split('+');
  expressionTerms.forEach((term) => {
    let result;
    if (term.includes('~')) result = evaluateTildeExpression(term);
    else if (term.includes('d')) result = evaluateDiceExpression(term);
    else result = evaluateConstantExpression(term);

    rollingResult += result.value;
    diceBodies = diceBodies.concat(result.dice);
  });

  return {
    value: rollingResult,
    dice: diceBodies
  }
}
