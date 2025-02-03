// Light/Dark Theme
const toggleElement = document.querySelector(".themes__toggle");

const toggleDarkTheme = () =>
  toggleElement.classList.toggle("themes__toggle--isActive");

const toggleDarkThemeWithEnter = (event) => {
  event.key === "Enter" && toggleDarkTheme();
};

toggleElement.addEventListener("keydown", toggleDarkThemeWithEnter);
toggleElement.addEventListener("click", toggleDarkTheme);

// Logic for calculator
let storedNumber = "";
let currentNumber = "";
let operation = "";
let history = [];

const historyEntriesElement = document.querySelector('.history__entries');
const resultElement = document.querySelector(".calc__result");
const keyElements = document.querySelectorAll("[data-type]");

const updateUI = (value) => {
  if (value === "Cannot be divided by zero") {
    resultElement.classList.add("calc__result--error");
    resultElement.innerText = value;
    const intervalId = setInterval(() => {

      resultElement.classList.remove("calc__result--error");
      resultElement.innerText = "0";
    }, 1500);

    setTimeout(() => {
      clearInterval(intervalId);
      resetButtonHandler()
    }, 2000);
  } else {
    resultElement.innerText = !value ? "0" : value;
  }
}


const updateHistory = (entry) => {
  history?.unshift(entry); // Add the operation at the beginning of the array.
  if (history.length > 2) history.pop(); //Specify the number of calculations to be recorded.

  historyEntriesElement.innerHTML = history
    .map(entry => `<div class="history__entry"> ${entry} </div>`)
    .join('');
};

const numberButtonHandler = (value) => {
  if (value === "." && currentNumber.includes(".")) {
    return;
  } else if (currentNumber.length === 18) {
    return;
  } else if (value === "0" && currentNumber === "0") { // Prevent adding multiple zeros at the beginning.
    return;
  } else if (value === "." && !currentNumber) { // Handle decimal point when starting with zero.
    currentNumber = "0.";
  } else {
    currentNumber += value;
  }

  // Remove extra zero at the beginning of numbers (e.g. 0005 → 5)
  while (currentNumber.startsWith("0") && currentNumber.length > 1 && !currentNumber.includes(".")) {
    currentNumber = currentNumber.slice(1);
  }

  updateUI(currentNumber);
};

const deleteButtonHandler = () => {
  if (!currentNumber || currentNumber === "0") return

  if (currentNumber.length === 1 || storedNumber === 1 || currentNumber === "0.") {
    currentNumber = "";
    storedNumber = "";
  } else {
    currentNumber = currentNumber.substring(0, currentNumber.length - 1)
  }

  updateUI(currentNumber)
}

const resetButtonHandler = () => {
  storedNumber = "";
  currentNumber = "";
  operation = "";
  history = [];
  historyEntriesElement.innerHTML = "";
  updateUI(currentNumber);
}

const operationUpdateUI = (firstNumber, operation, secondNumber) => {
  let newOperation = `${firstNumber} ${operation} ${secondNumber} = ${storedNumber}`
  updateUI(newOperation)
  currentNumber = "";
  operation = "";
}

const executeOperation = () => {
  if (!currentNumber && !storedNumber) return;

  if (currentNumber && storedNumber && operation) {
    const num1 = parseFloat(storedNumber);
    const num2 = parseFloat(currentNumber);

    if (operation === "➗" && num2 === 0 && num1 != 0) {
      updateUI("Cannot be divided by zero");
      return;
    }

    let result = 0;

    switch (operation) {
      case "➕":
        result = num1 + num2;
        break;
      case "➖":
        result = num1 - num2;
        break;
      case "✖️":
        result = num1 * num2;
        break;
      case "➗":
        result = num1 / num2;
        break;
    }

    if (num1 === 0 && num2 === 0) {
      result = 0
    }
    const historyEntry = `${num1} ${operation} ${num2} = ${result}`;
    updateHistory(historyEntry);

    storedNumber = result.toString();
    updateUI(storedNumber);
    currentNumber = "";
    operation = "";

  }

}

const operationButtonHandler = (operationValue) => {
  if (!currentNumber && !storedNumber) return

  if (currentNumber && !storedNumber) {
    storedNumber = currentNumber;
    currentNumber = "";
    operation = operationValue;
  } else if (storedNumber) {
    operation = operationValue;
    if (currentNumber) executeOperation();
  }
}


const keyElementsHandler = (element) => {
  element.addEventListener("click", () => {
    const type = element.dataset.type;

    if (type === "number") {
      numberButtonHandler(element.dataset.value);
    } else if (type === "operation") {
      switch (element.dataset.value) {
        case "c":
          resetButtonHandler();
          break;
        case "Backspace":
          deleteButtonHandler();
          break;
        case "Enter":
          executeOperation();
          break;
        default:
          operationButtonHandler(element.dataset.value);
          break;
      };
    };
  });
};

keyElements.forEach(keyElementsHandler);




// Use keyboard as input source
const availableNumbers = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".",
];
const availableOperations = ["+", "-", "*", "/"];
const availableKeys = [
  ...availableNumbers,
  ...availableOperations,
  "Backspace", "Enter", "c",
];
window.addEventListener("keydown", (event) => {
  // keyboardWithoutHover(event.key);
  keyboardWithHover(event.key);
})

// const keyboardWithoutHover = (key) => {
//   if (availableNumbers.includes(key)) {
//     numberButtonHandler(key)
//   } else if (availableOperations.includes(key)) {
//     operationButtonHandler(key);
//   } else if (key === "Backspace") {
//     deleteButtonHandler();
//   } else if (key === "Enter") {
//     executeOperation();
//   } else if (key === "c") {
//     resetButtonHandler();
//   }

// }

const keyboardWithHover = (key) => {
  if (availableKeys.includes(key)) {
    const element = document.querySelector(`[data-value="${key}"]`)
    element.classList.add("hover")
    element.click();
    setTimeout(() => element.classList.remove("hover"), 100)
  }
}