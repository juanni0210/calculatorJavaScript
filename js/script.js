// possible states we can be in
const states = {
    left: 'left',
    right: 'right',
    result: 'result'
};

// all key types
const keyTypes = {
    digit: 'digit',
    point: 'point',
    op: 'op',
    equal: 'equal',
    clear: 'clear'
};

// actions for updating the display
const updateDisplayAction = {
    set: 'set',
    append: 'append'
};

// create the calculator object
let calculator = {
    state: states.left,
    left: '',
    right: '',
    op: '',
    display: null,
    onKey: function (keyType, keyString) {
        // at any time 'C' is clicked, clear everything and return, no matter in what state
        if (keyType === keyTypes.clear) {
            this.reset();
            return;
        }

        // otherwise, based on the current state, do things accordingly
        switch (this.state) {
            case states.left:
                this.onLeft(keyType, keyString);
                break;
            case states.right:
                this.onRight(keyType, keyString);
                break;
            case states.result:
                this.onResult(keyType, keyString);
                break;
        }
    },
    onLeft: function (keyType, keyString) {
        // we are in the state of left, where you could update the 
        // left side number with either digit or the decimal point, or
        // receive an operator (which would change the state to right)
        switch (keyType) {
            case keyTypes.digit:
                this.left += keyString;
                break;
            case keyTypes.point:
                // make sure we allow only one decimal point
                if (this.left.includes('.'))
                    return;
                this.left += keyString;
                break;
            case keyTypes.op:
                // if there's no digit entered, and the user presses an operator, 
                // we treat the left number as 0
                if (this.left === '')
                    this.reset('0');
                // note the operator
                this.op = keyString;
                // change state to 'right', because an operator was entered, we can now update the right side
                this.state = states.right;
                break;
            default:
                return;
        }
        // all actions need to append the keyString to the display
        this.setDisplay(keyString, updateDisplayAction.append);
    },
    onRight: function (keyType, keyString) {
        // now we are in the state to update the right side, where we could
        // update the right side number with digit or point, chain another 
        // operation, or get the result
        switch (keyType) {
            case keyTypes.digit:
                this.right += keyString;
                this.setDisplay(keyString, updateDisplayAction.append);
                break;
            case keyTypes.point:
                if (this.right.includes('.'))
                    return;
                this.right += keyString;
                this.setDisplay(keyString, updateDisplayAction.append);
                break;
            case keyTypes.op:
                // if no number was entered for the right side, but the user presses an operator, ignore it
                if (this.right === '')
                    return;
                // otherwise, we do the chaining
                // first, calculate the result with the current two numbers, 
                // and treat the result as a new left side number, and display it
                this.left = this.calculate();
                this.setDisplay(this.left, updateDisplayAction.set);
                // note the operator
                this.op = keyString;
                // reset the right side number, because we technically re-entered the right state, 
                // and we are about to update the right side number on next key press
                this.right = '';
                // append the operator to the display
                this.setDisplay(keyString, updateDisplayAction.append);
                break;
            case keyTypes.equal:
                // if no number was entered for the right side, but the user presses equal, ignore it
                if (this.right === '')
                    return;
                // otherwise, calculate the result and display the result, and change the state to result
                this.setDisplay(this.calculate().toString(), updateDisplayAction.set);
                this.state = states.result;
                break;
        }
    },
    onResult: function (keyType, keyString) {
        // now we are in the result state, where the user could launch a new calculation with digit or '.',
        // or chain a new operation on the result
        switch (keyType) {
            case keyTypes.digit:
                // new calculation, reset to left state, and update the display and left side number with the input
                this.reset(keyString);
                break;
            case keyTypes.point:
                // new calculation, reset to left state, and update the display and left side number with the input
                this.reset(this.display.value + keyString);
                break;
            case keyTypes.op:
                // chain a new operation on the result, treat the result as a left side number
                this.left = this.display.value;
                // note the operator
                this.op = keyString;
                // append the operator to the display
                this.setDisplay(keyString, updateDisplayAction.append);
                // remember to clear the right number before we go to the right state
                this.right = '';
                // change the state to right, because now we already have a left side number and an operator, 
                // we should be updating the right side now
                this.state = states.right;
                break;
        }
    },
    calculate: function () {
        let result;
        let left = parseFloat(this.left);
        let right = parseFloat(this.right);
        switch (this.op) {
            case '+':
                result = left + right;
                break;
            case '-':
                result = left - right;
                break;
            case '*':
                result = left * right;
                break;
            case '/':
                result = left / right;
                break;
        }
        return result;
    },
    setDisplay: function (newContent, action) {
        switch (action) {
            case updateDisplayAction.set:
                this.display.value = newContent;
                break;
            case updateDisplayAction.append:
                this.display.value += newContent;
                break;
        }
    },
    reset: function (withLeft = '') {
        // sometimes we want to reset with an input, because other states can only
        // change to left state with an input for a new calculation, we want to keep that input
        this.left = withLeft;
        this.right = '';
        this.op = '';
        this.state = states.left;
        this.setDisplay(withLeft, updateDisplayAction.set);
    }
};

window.onload = function () {
    let btns = document.querySelectorAll(".btn");
    calculator.display = document.querySelector(".form-control");

    for (let btn of btns) {
        // get the label and key type once, and delegate them to the calculator's onKey function
        // so we don't have to get them everytime we click a button, they won't change
        let label = btn.value;
        let type = getKeyType(label);
        btn.addEventListener("click", (e) => {
            calculator.onKey(type, label);
        });
    }
}

function getKeyType(label) {
    if (!isNaN(parseInt(label)))
        return keyTypes.digit;
    if (label === '.')
        return keyTypes.point;
    if (label === '+' || label === '-' || label === '*' || label === '/')
        return keyTypes.op;
    if (label === 'C')
        return keyTypes.clear;
    if (label === '=')
        return keyTypes.equal;
}