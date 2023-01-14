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

  draw: function () {
    this.docElement.innerText = this.valueString;
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

const numberButtons = document.querySelectorAll(".number");
for (let i = 0; i < numberButtons.length; i++) {
  let number = numberButtons[i];
  number.addEventListener("click", (e) => {
    // If the last operator pressed was "equals" and then a new
    // number is input, then the user is starting a new equation
    // and the old info should be cleared
    if (lastOperator === "equals" || typeof total === "string") allClear();
    if (inputNextOperand) {
      inputNextOperand = false;
      display.clear();
    }
    if (e.target.id !== "decimal") {
      display.append(e.target.innerText);
      display.deletable = true;
    }
  });
}

const operatorButtons = document.querySelectorAll(".operator");
for (i = 0; i < operatorButtons.length; i++) {
  let operatorButton = operatorButtons[i];

  operatorButton.addEventListener("click", (e) => {
    let lastOperatorButton = document.querySelector(".active");
    if (lastOperatorButton) lastOperatorButton.classList.remove("active");
    operatorButton.classList.add("active");

    if (typeof total === "string") allClear();
    // Every operator works as an equals button except that if the
    // last operator was "equals" then there's no need to update "total"
    if (lastOperator !== "equals") {
      total = operate(lastOperator, total, display.value);
    }
    lastOperator = e.target.id;
    display.update(total);
    display.deletable = false;
    inputNextOperand = true;
  });
}

const decimalButton = document.querySelector("#decimal");
decimalButton.addEventListener("click", () => {
  if (display.valueString.includes(".")) return;
  display.valueString += ".";
  display.draw();
});

const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", () => display.delete());

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", allClear);

const changeSignButton = document.querySelector(".sign");
changeSignButton.addEventListener("click", () => display.changeSign());

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
  return +divisor === 0 ? "how dare you..." : numerator / divisor;
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
      break;
    default:
      return "Invalid operator";
  }
  return +result.toFixed(10);
}
