let total = 0;
let lastOperator = "add";
let inputNextOperand = false;

const MAX_CHARS = 13;
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const changeSignButton = document.querySelector(".sign");
const deleteButton = document.querySelector(".delete");
const clearButton = document.querySelector(".clear");

document.addEventListener("keydown", handleKeyboardInput);
changeSignButton.addEventListener("click", () => display.changeSign());
deleteButton.addEventListener("click", () => display.delete());
clearButton.addEventListener("click", clearAll);
numberButtons.forEach((button) =>
  button.addEventListener("click", (e) => inputNumber(e.target.innerText))
);
operatorButtons.forEach((button) =>
  button.addEventListener("click", (e) => inputOperator(e.currentTarget.id))
);

let display = {
  value: "0",
  deletable: true,
  docElement: document.querySelector(".display"),
  update: function (value) {
    // Select all leading 0's except for one right before a decimal
    let regEx = /^0+(?!\.)\B/;
    this.value = value.replace(regEx, "");
    this.docElement.innerText = this.value;
  },
  append: function (newDigit) {
    this.update(this.value + newDigit);
  },
  delete: function () {
    if (this.deletable) {
      let newValue = this.value.slice(0, -1);
      newValue.length === 0 ? this.update("0") : this.update(this.value.slice(0, -1));
    }
  },
  changeSign: function () {
    this.update((-1 * this.value).toString());
    if (inputNextOperand) total *= -1;
  },
};
display.update("0");

function handleKeyboardInput(e) {
  let key = e.key;
  e.preventDefault();
  if (/[0-9.]/.test(key)) inputNumber(key);
  if (key === "Shift") display.changeSign();
  if (key === "Backspace") clearAll();
  if (key === "Delete") display.delete();
  if (key === "Enter" || /[\+\-\*\/\=]/.test(key)) inputOperator(getOperation(key));
}

function getOperation(key) {
  if (key === "+") return "add";
  if (key === "-") return "subtract";
  if (key === "*") return "multiply";
  if (key === "/") return "divide";
  if (key === "Enter" || key === "=") return "equals";
}

function inputNumber(number) {
  // User is starting a new equation and the old info should be cleared
  if (lastOperator === "equals" || typeof total === "string") clearAll();

  if (inputNextOperand) {
    inputNextOperand = false;
    display.update("0");
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

  // No need to update "total" since there is no associated operation
  if (lastOperator !== "equals") {
    total = operate(lastOperator, total, +display.value);
  }

  let processedString = total.toString();
  if (typeof total === "number" && processedString.length > MAX_CHARS) {
    let ints = Math.floor(total);
    if (ints.toString().length >= MAX_CHARS) {
      // 8 characters max needed to represent big number in scientific notation: -X.___e+XXX
      processedString = ints.toExponential(MAX_CHARS - 8);
    } else {
      processedString = total.toFixed(MAX_CHARS - ints.toString().length - 1);
    }
  }

  lastOperator = operator;
  display.update(processedString);
  display.deletable = false;
  inputNextOperand = true;
}

function clearAll() {
  display.update("0");
  total = 0;
  lastOperator = "add";
  let lastOperatorButton = document.querySelector(".active");
  if (lastOperatorButton) lastOperatorButton.classList.remove("active");
}

function operate(operator, x, y) {
  let result;
  if (operator === "add") result = x + y;
  if (operator === "subtract") result = x - y;
  if (operator === "multiply") result = x * y;
  if (operator === "divide") result = x / y;
  if (isNaN(result) || !isFinite(result)) result = "how dare you";
  return result;
}
