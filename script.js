let total = 0;
let lastOperator = "add";
let inputNextOperand = false;

let display = {
  value: "0",
  deletable: true,
  docElement: document.querySelector(".display"),

  update: function (value) {
    if (value !== undefined) {
      // This regular expression will select all leading 0's except
      // for one right before a decimal
      let regEx = /^0+(?!\.)\B/;
      this.value = value.replace(regEx, "");
    }
    this.docElement.innerText = this.value;
  },

  append: function (newDigit) {
    this.update(this.value + newDigit);
  },

  delete: function () {
    if (this.deletable) {
      let newValue = this.value.slice(0, -1);
      newValue.length === 0
        ? this.update("0")
        : this.update(this.value.slice(0, -1));
    }
  },

  clear: function () {
    this.update("0");
  },

  changeSign: function () {
    this.value = -1 * this.value;
    this.update();
    if (inputNextOperand) total *= -1;
  },
};
display.update();

// KEYBOARD SUPPORT

document.addEventListener("keydown", (e) => {
  if (/[0-9.]/.test(e.key)) {
    inputNumber(e.key);
  } else if (e.key === "Shift") {
    display.changeSign();
  } else if (e.key === "Backspace") {
    clearAll();
  } else if (e.key === "Delete") {
    display.delete();
  } else if (e.key === "Enter" || /[\+\-\*\/]/.test(e.key)) {
    let operation;
    switch (e.key) {
      case "+":
        operation = "add";
        break;
      case "-":
        operation = "subtract";
        break;
      case "*":
        operation = "multiply";
        break;
      case "/":
        operation = "divide";
        break;
      case "Enter":
        operation = "equals";
        break;
    }
    inputOperator(operation);
  }
});

// MOUSE SUPPORT

const numberButtons = document.querySelectorAll(".number");
for (let i = 0; i < numberButtons.length; i++) {
  let number = numberButtons[i];
  number.addEventListener("click", (e) => inputNumber(e.target.innerText));
}

const operatorButtons = document.querySelectorAll(".operator");
for (i = 0; i < operatorButtons.length; i++) {
  let operatorButton = operatorButtons[i];
  operatorButton.addEventListener(
    "click",
    (e) => {
      inputOperator(e.currentTarget.id);
    },
    false
  );
}

const changeSignButton = document.querySelector(".sign");
changeSignButton.addEventListener("click", () => display.changeSign());

const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", () => display.delete());

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", clearAll);

// FUNCTIONS

function inputNumber(number) {
  // If the last operator pressed was "equals" and then a new
  // number is input, then the user is starting a new equation
  // and the old info should be cleared
  if (lastOperator === "equals" || typeof total === "string") clearAll();

  if (inputNextOperand) {
    inputNextOperand = false;
    display.clear();
  }

  if (number === "." && display.value.includes(".")) return;
  display.append(number);
  display.deletable = true;
}

function inputOperator(operator) {
  let lastOperatorButton = document.querySelector(".active");
  if (lastOperatorButton) lastOperatorButton.classList.remove("active");
  let operatorButton = document.querySelector("#" + operator);
  operatorButton.classList.add("active");

  // 'total' should only be a string after a divide by zero result
  if (typeof total === "string") clearAll();

  // If the last operator was "equals" then there's no need to
  // update "total" since there is no associated operation
  if (lastOperator !== "equals") {
    total = operate(lastOperator, total, +display.value);
  }
  lastOperator = operator;
  display.update(total.toString());
  display.deletable = false;
  inputNextOperand = true;
}

function clearAll() {
  display.clear();
  total = 0;
  lastOperator = "add";
  let lastOperatorButton = document.querySelector(".active");
  if (lastOperatorButton) lastOperatorButton.classList.remove("active");
}

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

function multiply(x, y) {
  return x * y;
}

function divide(numerator, divisor) {
  return numerator / divisor;
}

function operate(operator, x, y) {
  let result;
  switch (operator) {
    case "add":
      result = add(x, y);
      break;
    case "subtract":
      result = subtract(x, y);
      break;
    case "multiply":
      result = multiply(x, y);
      break;
    case "divide":
      result = divide(x, y);
      if (isNaN(result) || !isFinite(result)) result = "how dare you";
      break;
    default:
      result = "Invalid operator";
  }
  return typeof result === "string" ? result : +result.toFixed(10);
}
