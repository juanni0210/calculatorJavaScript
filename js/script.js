let btns;
let displayText;
let num1;
let num2;
let operator;
let result;
let isSecondNum;
let newCalculation;

window.onload = function () {
    btns = document.querySelectorAll(".btn");
    displayText = document.querySelector(".form-control");

    for (let btn of btns) {
        btn.addEventListener("click", handleCalculate);
    }

    resetData();
}

function calculate() {
    let tempNum1 = parseFloat(num1);
    let tempNum2 = parseFloat(num2);
    if(operator.length > 1) {
        displayText.value = "Error";
        resetData();
        return false;
    }

    switch (operator) {
        case '+':
            result = tempNum1 + tempNum2;
            break;
        case '-':
            result = tempNum1 - tempNum2;
            break;
        case '*':
            result = tempNum1 * tempNum2;
            break;
        case '/':
            result = tempNum1 / tempNum2;
            break;
    }
    displayText.value = result.toString();
    resetData();
    return false;
}


function handleCalculate(e) {
    
    if(newCalculation) {
        clearUI();
        newCalculation = false;
    }

    let eventTargetObject = e.target;
    let btnLabel = eventTargetObject.value;
    if (btnLabel === '=') {
        return;
    }
    if (btnLabel === 'C') {
        resetData();
        clearUI();
        return;
    }

    let isDigit = parseInt(btnLabel);
    if (!isNaN(isDigit) || btnLabel === '.') {
        if (!isSecondNum) {
            num1 += btnLabel;
        } else {
            num2 += btnLabel;
        }
    } else {
        operator += btnLabel;
        isSecondNum = true;
    }

    displayText.value = displayText.value + btnLabel;
}

function resetData() {
    num1 = '';
    num2 = '';
    operator = '';
    isSecondNum = false;
    newCalculation = true;
}

function clearUI() {
    displayText.value = '';
}