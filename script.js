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
};
display.update();

numberButtons = document.querySelectorAll(".number");
for (let i = 0; i < numberButtons.length; i++) {
  let number = numberButtons[i];
  number.addEventListener("click", (e) => display.append(e.target.innerText));
}

clearButton = document.querySelector(".clear");
clearButton.addEventListener("click", (e) => display.update(0));

function add(x, y) {
  return x + y;
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
