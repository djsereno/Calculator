let total = 0;
let lastOperator = "add";
let inputNextOperand = false;
let display = {
  value: 0,
  valueString: "0",
  deletable: true,
  docElement: document.querySelector(".display"),

  update: function (value) {
    if (value !== undefined) {
      this.value = +value;
      this.valueString = this.value.toString().substring(0, 13);
      if (typeof value === "string" && value.slice(-1) === ".")
        this.valueString += ".";
    } else {
      this.valueString = this.value.toString().substring(0, 13);
    }
    this.draw();
  },

  draw: function (message) {
    if (message) {
      this.docElement.innerText = message;
    } else {
      this.docElement.innerText = this.valueString;
    }
  },

  append: function (newDigit) {
    if (newDigit === "." && this.value % 1 !== 0) return;
    this.update(this.valueString + newDigit);
  },

  delete: function () {
    if (this.deletable) {
      let newValue = this.valueString.substring(0, this.valueString.length - 1);
      this.update(newValue);
    }
  },

  clear: function () {
    this.update(0);
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
    numberInput(e.key);
    if (e.key === ".") decimalInput();
  } else if (e.key === "Shift") {
    display.changeSign();
  } else if (e.key === "Backspace") {
    display.delete();
  } else if (e.key === "Delete") {
    allClear();
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
    operatorInput(operation);
  }
});

const numberButtons = document.querySelectorAll(".number");
for (let i = 0; i < numberButtons.length; i++) {
  let number = numberButtons[i];
  number.addEventListener("click", (e) => numberInput(e.target.innerText));
}

const operatorButtons = document.querySelectorAll(".operator");
for (i = 0; i < operatorButtons.length; i++) {
  let operatorButton = operatorButtons[i];
  operatorButton.addEventListener("click", (e) => operatorInput(e.target.id));
}

const decimalButton = document.querySelector("#decimal");
decimalButton.addEventListener("click", decimalInput);

const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", () => display.delete());

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", allClear);

const changeSignButton = document.querySelector(".sign");
changeSignButton.addEventListener("click", () => display.changeSign());

function numberInput(number) {
  // If the last operator pressed was "equals" and then a new
  // number is input, then the user is starting a new equation
  // and the old info should be cleared
  if (lastOperator === "equals" || typeof total === "string") allClear();
  if (inputNextOperand) {
    inputNextOperand = false;
    display.clear();
  }
  if (number !== ".") {
    display.append(number);
    display.deletable = true;
  }
}

function operatorInput(operator) {
  let lastOperatorButton = document.querySelector(".active");
  if (lastOperatorButton) lastOperatorButton.classList.remove("active");

  let operatorButton = document.querySelector("#" + operator);
  operatorButton.classList.add("active");

  if (typeof total === "string") allClear();
  // Every operator works as an equals button except that if the
  // last operator was "equals" then there's no need to update "total"
  if (lastOperator !== "equals") {
    total = operate(lastOperator, total, display.value);
  }
  lastOperator = operator;
  typeof total === "string" ? display.draw(total) : display.update(total);
  display.deletable = false;
  inputNextOperand = true;
}

function decimalInput() {
  if (display.valueString.includes(".")) return;
  display.valueString += ".";
  display.draw();
}

function allClear() {
  display.clear();
  total = 0;
  lastOperator = "add";
  let lastOperatorButton = document.querySelector(".active");
  if (lastOperatorButton) lastOperatorButton.classList.remove("active");
}

function add(x, y) {
  return +x + +y;
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
      if (isNaN(result)) result = "how dare you";
      break;
    default:
      result = "Invalid operator";
  }
  return typeof result === "string" ? result : +result.toFixed(10);
}
