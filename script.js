let total = 0;
let lastOperator = "add";
let inputNextOperand = false;
let display = {
  value: 0,
  docElement: document.querySelector(".display"),
  update: function (value) {
    if (value !== undefined) this.value = value;
    this.docElement.innerText = this.value;
  },
  append: function (value) {
    let newValue = this.value.toString() + value;
    this.update(+newValue);
  },
  clear: function () {
    this.update(0);
  },
};
display.update();

numberButtons = document.querySelectorAll(".number");
for (let i = 0; i < numberButtons.length; i++) {
  let number = numberButtons[i];
  number.addEventListener("click", (e) => {
    // If the last operator pressed was "equals" and then a new
    // number is input, then the user is starting a new equation
    // and the old info should be cleared
    if (lastOperator === "equals") allClear();

    if (inputNextOperand) {
      inputNextOperand = false;
      display.update(e.target.innerText);
    } else {
      display.append(e.target.innerText);
    }
  });
}

clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", allClear);

operatorButtons = document.querySelectorAll(".operator");
for (i = 0; i < operatorButtons.length; i++) {
  let operatorButton = operatorButtons[i];
  console.log(operatorButton);

  operatorButton.addEventListener("click", (e) => {
    // Every operator works as an equals button except that if the
    // last operator was "equals" then there's no need to update "total"
    if (lastOperator !== "equals") {
      total = operate(lastOperator, total, display.value);
    }
    lastOperator = e.target.id;
    display.update(total);
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

function divide(x, y) {
  return x / y;
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
