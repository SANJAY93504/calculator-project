const display = document.getElementById("display");
const previousDisplay = document.getElementById("previousDisplay");
const historyList = document.getElementById("historyList");


// Store calculation history
let history = [];


// Add value to display
function addValue(value) {

    if (display.value === "Error") {
        display.value = "0";
    }

    if (display.value === "0" && value !== ".") {
        display.value = "";
    }

    display.value += value;
}


// Clear display
function clearDisplay() {

    display.value = "0";

    previousDisplay.textContent = "";
}


// Delete last character
function deleteLast() {

    if (
        display.value === "Error" ||
        display.value.length <= 1
    ) {
        display.value = "0";
        return;
    }

    display.value =
        display.value.slice(0, -1);
}


// Calculate result
function calculate() {

    let expression = display.value;

    if (
        expression === "" ||
        expression === "0"
    ) {
        return;
    }

    try {

        // Convert percentage
        expression = expression.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Validate expression
        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        let result = Function(
            '"use strict"; return (' +
            expression +
            ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }

        previousDisplay.textContent =
            display.value + " =";

        display.value =
            Number(result.toFixed(10));

        addToHistory(
            expression,
            display.value
        );

    } catch (error) {

        display.value = "Error";

    }
}


// Add calculation to history
function addToHistory(expression, result) {

    history.unshift({
        expression: expression,
        result: result
    });

    // Maximum 10 history records
    if (history.length > 10) {
        history.pop();
    }

    updateHistory();
}


// Update history UI
function updateHistory() {

    historyList.innerHTML = "";

    if (history.length === 0) {

        historyList.innerHTML =
            '<p class="empty">No calculations yet</p>';

        return;
    }

    history.forEach(function(item) {

        const div =
            document.createElement("div");

        div.className = "history-item";

        div.textContent =
            item.expression +
            " = " +
            item.result;

        historyList.appendChild(div);
    });
}


// Clear history
function clearHistory() {

    history = [];

    updateHistory();
}


// Dark / Light mode
function toggleTheme() {

    document.body.classList.toggle("dark");

    const button =
        document.getElementById("themeBtn");

    if (
        document.body.classList.contains("dark")
    ) {
        button.textContent = "☀️";
    } else {
        button.textContent = "🌙";
    }
}


// Keyboard support
document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;

        if (
            (key >= "0" && key <= "9") ||
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/" ||
            key === "." ||
            key === "%"
        ) {

            addValue(key);

        } else if (key === "Enter" || key === "=") {

            calculate();

        } else if (key === "Backspace") {

            deleteLast();

        } else if (key === "Escape") {

            clearDisplay();
        }
    }
);