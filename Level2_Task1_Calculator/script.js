/* =========================================
   PROFESSIONAL CALCULATOR
   Oasis Infobyte - Level 2 Task 1
   ========================================= */

// ---------- Display Elements ----------

const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");


// ---------- Calculator State ----------

let currentValue = "0";
let previousValue = "";
let selectedOperator = null;
let shouldResetDisplay = false;


// ---------- Update Display ----------

function updateDisplay() {
    currentDisplay.textContent = currentValue;

    if (selectedOperator && previousValue !== "") {
        previousDisplay.textContent = `${previousValue} ${selectedOperator}`;
    } else {
        previousDisplay.textContent = "";
    }
}


// ---------- Number Input ----------

function inputNumber(number) {

    if (shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (currentValue === "0") {
        currentValue = number;
    } else if (currentValue.length < 15) {
        currentValue += number;
    }

    updateDisplay();
}


// ---------- Decimal Input ----------

function inputDecimal() {

    if (shouldResetDisplay) {
        currentValue = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    if (!currentValue.includes(".") && currentValue.length < 15) {
        currentValue += ".";
    }

    updateDisplay();
}


// ---------- Operator Selection ----------

function selectOperator(operator) {

    if (selectedOperator !== null && !shouldResetDisplay) {
        calculateResult();
    }

    previousValue = currentValue;
    selectedOperator = operator;
    shouldResetDisplay = true;

    updateDisplay();
}


// ---------- Calculation ----------

function calculateResult() {

    if (
        selectedOperator === null ||
        previousValue === "" ||
        shouldResetDisplay
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (selectedOperator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {
                currentValue = "Cannot divide by 0";
                previousValue = "";
                selectedOperator = null;
                shouldResetDisplay = true;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    currentValue = formatResult(result);

    previousValue = "";
    selectedOperator = null;
    shouldResetDisplay = true;

    updateDisplay();
}


// ---------- Result Formatting ----------

function formatResult(result) {

    if (!Number.isFinite(result)) {
        return "Error";
    }

    return String(Number(result.toPrecision(12)));
}


// ---------- Clear Calculator ----------

function clearCalculator() {

    currentValue = "0";
    previousValue = "";
    selectedOperator = null;
    shouldResetDisplay = false;

    updateDisplay();
}


// ---------- Backspace ----------

function deleteLastDigit() {

    if (shouldResetDisplay) {
        return;
    }

    if (
        currentValue.length === 1 ||
        currentValue === "Cannot divide by 0"
    ) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);

        if (currentValue === "-" || currentValue === "") {
            currentValue = "0";
        }
    }

    updateDisplay();
}


// ---------- Button Event Listeners ----------

// Number and decimal buttons
const numberButtons = document.querySelectorAll("[data-number]");

numberButtons.forEach(button => {

    button.addEventListener("click", () => {

        const number = button.dataset.number;

        inputNumber(number);

    });

});


// Decimal button
const decimalButton = document.querySelector('[data-action="decimal"]');

decimalButton.addEventListener("click", () => {
    inputDecimal();
});


// Operator buttons
const operatorButtons = document.querySelectorAll("[data-operator]");

operatorButtons.forEach(button => {

    button.addEventListener("click", () => {

        const operator = button.dataset.operator;

        selectOperator(operator);

    });

});


// Clear button
const clearButton = document.querySelector('[data-action="clear"]');

clearButton.addEventListener("click", () => {
    clearCalculator();
});


// Backspace button
const backspaceButton = document.querySelector(
    '[data-action="backspace"]'
);

backspaceButton.addEventListener("click", () => {
    deleteLastDigit();
});


// Equals button
const equalsButton = document.querySelector(
    '[data-action="calculate"]'
);

equalsButton.addEventListener("click", () => {
    calculateResult();
});


// ---------- Keyboard Support ----------

document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers
    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }

    // Decimal
    if (key === ".") {
        inputDecimal();
        return;
    }

    // Operators
    if (key === "+" || key === "-") {
        selectOperator(key);
        return;
    }

    if (key === "*") {
        selectOperator("×");
        return;
    }

    if (key === "/") {
        event.preventDefault();
        selectOperator("÷");
        return;
    }

    // Equals
    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
        return;
    }

    // Backspace
    if (key === "Backspace") {
        deleteLastDigit();
        return;
    }

    // Escape = Clear
    if (key === "Escape") {
        clearCalculator();
    }
});


// ---------- Initial Display ----------

updateDisplay();