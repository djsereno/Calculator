let total = 0;
let lastOperator = "add";
let inputNextOperand = false;
let display = {
  value: 0,
  deletable: true,
  docElement: document.querySelector(".display"),
  update: function (value) {
    if (value !== undefined) this.value = value;
    this.docElement.innerText = this.value;
  },
  append: function (value) {
    let newValue = this.value.toString() + value;
    this.update(+newValue);
  },
  delete: function () {
    if (this.deletable) {
      let newValue = this.value.toString();
      newValue = newValue.substring(0, newValue.length - 1);
      this.update(+newValue);
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
      display.update(e.target.innerText);
    } else {
      display.append(e.target.innerText);
    }
    display.deletable = true;
  });
}

const deleteButton = document.querySelector(".delete");
deleteButton.addEventListener("click", () => display.delete());

const clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", allClear);

const changeSignButton = document.querySelector(".sign");
changeSignButton.addEventListener("click", () => display.changeSign());

const operatorButtons = document.querySelectorAll(".operator");
for (i = 0; i < operatorButtons.length; i++) {
  let operatorButton = operatorButtons[i];

  operatorButton.addEventListener("click", (e) => {
    if (typeof total === "string") allClear();
    // Every operator works as an equals button except that if the
    // last operator was "equals" then there's no need to update "total"
    if (lastOperator !== "equals") {
      total = operate(lastOperator, total, display.value);
    }
    console.log(total, typeof total);
    lastOperator = e.target.id;
    display.update(total);
    display.deletable = false;
    inputNextOperand = true;
  });
}

function allClear() {
  display.clear();
  total = 0;
  lastOperator = "add";
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
  switch (operator) {
    case "add":
      return add(x, y);
      break;
    case "subtract":
      return subtract(x, y);
      break;
    case "multiply":
      return multiply(x, y);
      break;
    case "divide":
      return divide(x, y);
      break;
    default:
      return "Invalid operator";
  }
}
