/**
 * @name MathSolver
 * @version 1.2
 * @author Theuns Coetzee (Original author up to version 1.0: Nic Raboy)
 * @description Converts infix to postfix, Calculates Postfix.
 * Origin: https://www.thepolyglotdeveloper.com/2015/04/evaluate-a-reverse-polish-notation-equation-with-javascript/
 * Fixed infixToPostfix returning a space at the end of the string
 * replace some for loops with "for of" loops
 * change variable declaration to ES6 format (let, const)
 * RPN calculation failed if infix problem string starts with a negative number. Fixed.
 * Fix infixToPostfix to add a 0 at the beginning of the string if it starts with a negative number.
 * Not calculating floats, fixed. Changed parseInt to parseFloat.
 *
 * TODO: Incorporate prepInfixString Function into class.
 * // TODO: Replace all prototype usage of isNumeric with Function isNumeric.
 *
 */
// String.prototype.isNumeric = function () {
//   return !isNaN(parseFloat(this)) && isFinite(this);
// };
// above replaced with below

const isNumeric = num => !isNaN(parseFloat(num)) && isFinite(num);

Array.prototype.clean = function () {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === '') {
      this.splice(i, 1);
    }
  }
  return this;
};

/**
 * @name prepInfixString
 * @version 0.2
 * @param {String} str
 * @returns Valid infix string
 * // @requires isNumeric (Prototype)
 * @author Theuns Coetzee
 * @description Mathsolver expects to process a valid infix string,
 * prepInfixString will attempt to correct, where possible, flaws in the infix string
 * to allow the infix to postfix converter to process the string successfully.
 *
 * TODO: Check if every decimal is preceded and succeeded by a number.
 * TODO: If decimal is succeeded with an operator, remove that decimal from the string.
 * TODO: Check if equal amount of opening and closing brackets.
 * TODO: If open bracket count is +1 of close bracket count then close string with closing bracket,
 * TODO: Else return ERROR.
 *
 */

function prepInfixString(str) {
/**
 * # Rules
 * String must start with a numerical operand or opening bracket
 * String must end with a numerical operand or closing bracket
 * String may not start or end with a space
 * String may not start or end with an operator /+-*^
 * String may not start or end with a decimal separator/period
 */
  // 1: Remove spaces from start and end of string
  let newStr = str.trim();
  // let correctedInfixString = ''; // Create a new blank string that we can fill with the corrected string.

  // 2: Prep start of string
  // 2.1: If first character is an operator and second is numeric, add 0 before
  if (newStr.substring(0, 1).match(/[+-.]/) !== null && Number.isNaN(newStr.substring(1, 2)) !== true) {
    newStr = `0${newStr}`;
  } else if (newStr.substring(0, 1).match(/[/*^]/) !== null) { // 2.2: Remove first character if it's a division, multiplication or exponent operator
    newStr = newStr.substring(1);
  }

  // 3: Prep end of string
  // 3.1 Remove operators from end of string
  /* Test arguments
  console.log(newStr.split('').slice(0, -1).join(''));
  console.log(newStr.substring(0, newStr.length - 1));
  console.log(newStr.substring(newStr.length - 1).isNumeric());
  */
  while (isNumeric(newStr.substring(newStr.length - 1)) !== true && newStr.substring(newStr.length - 1) !== ')') {
    newStr = newStr.substring(0, newStr.length - 1);
  }

  //   newStr = tempStr;
  //   if (newStr.split(''))
  //   if (correctedInfixString === '') { correctedInfixString = newStr; }
  return newStr;
}

function MathSolver() {
  this.infixToPostfix = function (infix) {
    // infix = infix.trim();
    // if (infix.startsWith('-')) {
    //   infix = 0 + infix;
    // }
    infix = prepInfixString(infix);
    let outputQueue = '';
    const operatorStack = [];
    const operators = {
      '^': {
        precedence: 4,
        associativity: 'Right',
      },
      '/': {
        precedence: 3,
        associativity: 'Left',
      },
      '*': {
        precedence: 3,
        associativity: 'Left',
      },
      '+': {
        precedence: 2,
        associativity: 'Left',
      },
      '-': {
        precedence: 2,
        associativity: 'Left',
      },
    };
    infix = infix.replace(/\s+/g, '');
    infix = infix.split(/([\+\-\*\/\^\(\)])/).clean();
    for (let i = 0; i < infix.length; i++) {
      const token = infix[i];
      if (isNumeric(token)) {
        outputQueue += `${token} `;
      } else if ('^*/+-'.indexOf(token) !== -1) {
        const o1 = token;
        let o2 = operatorStack[operatorStack.length - 1];
        while ('^*/+-'.indexOf(o2) !== -1 && ((operators[o1].associativity === 'Left' && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === 'Right' && operators[o1].precedence < operators[o2].precedence))) {
          outputQueue += `${operatorStack.pop()} `;
          o2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(o1);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue += `${operatorStack.pop()} `;
        }
        operatorStack.pop();
      }
    }
    while (operatorStack.length > 0) {
      outputQueue += `${operatorStack.pop()} `;
    }
    return outputQueue.trim();
  };

  this.solvePostfix = function (postfix) {
    const resultStack = [];
    postfix = postfix.trim().split(' ');
    for (const item of postfix) {
      if (isNumeric(item)) {
        resultStack.push(item);
      } else {
        const a = parseFloat(resultStack.pop());
        const b = parseFloat(resultStack.pop());
        if (item === '+') {
          resultStack.push(a + b);
        } else if (item === '-') {
          resultStack.push(b - a);
        } else if (item === '*') {
          resultStack.push(a * b);
        } else if (item === '/') {
          resultStack.push(b / a);
        } else if (item === '^') {
          resultStack.push(Math.pow(b, a));
        }
      }
    }

    if (resultStack.length > 1) {
      return 'error';
    }
    return resultStack.pop();
  };
}
/** Usage:
const calculator = new MathSolver();
const problem1 = '5 + 3 * 6 - ( 5 / 3 ) + 7';
const theSum = calculator.infixToPostfix(problem1);
const theAnswer = calculator.solvePostfix(theSum);
 */

