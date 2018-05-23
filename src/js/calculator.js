/* eslint-disable no-unused-vars */

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const divide = (a, b) => a / b;
const multiply = (a, b) => a * b;

// use reduce to sum our array

// const numbers = [5,4,2]
// console.log(numbers.reduce(divide));
let calcStr = '0';
const plusArr = [];
calcStr = '20*2+10/2-5';
const calcStrArr = calcStr.split('+');

console.log(calcStrArr);
// console.log(isNaN(calcStrArr[0]));

function addition(...numbers) {
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

function subtraction(...numbers) {
  let total = numbers[0];
  for (const num of numbers.slice(1)) {
    total -= num;
  }
  return total;
}
console.log(subtraction(2, 3, -1, 25, 12));

