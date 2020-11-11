const states = {
    left: 'left',
    right: 'right',
    equal: 'equal'
};

const keyTypes = {
    digit: 'digit',
    point: 'point',
    op: 'op',
    equal: 'equal',
    clear: 'clear'
};

const updateDisplayAction = {
    set: 'set',
    append: 'append'
};

let calculator = {
    state: states.left,
    left: '',
    right: '',
    op: '',
    display: null,
    initialize: function (displayText) { this.display = displayText; },
    onKey: function (keyType, keyString) {
        if (keyType === keyTypes.clear) {
            this.reset();
            return;
        }

        switch (this.state) {
            case states.left:
                this.onLeft(keyType, keyString);
                break;
            case states.right:
                this.onRight(keyType, keyString);
                break;
            case states.equal:
                this.onEqual(keyType, keyString);
                break;
        }
    },
    onLeft: function (keyType, keyString) {
        switch (keyType) {
            case keyTypes.digit:
                this.left += keyString;
                break;
            case keyTypes.point:
                if (this.left.includes('.'))
                    return;
                this.left += keyString;
                break;
            case keyTypes.op:
                if (this.left === '')
                    this.reset('0');
                this.op = keyString;
                this.state = states.right;
                break;
            default:
                return;
        }
        this.setDisplay(keyString, updateDisplayAction.append);
    },
    onRight: function (keyType, keyString) {
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
                this.left = this.calculate();
                this.setDisplay(this.left, updateDisplayAction.set);
                this.op = keyString;
                this.right = '';
                this.setDisplay(keyString, updateDisplayAction.append);
                break;
            case keyTypes.equal:
                if (this.right === '')
                    return;

                this.reset(this.calculate().toString());
                this.state = states.equal;
                break;
        }
    },
    onEqual: function (keyType, keyString) {
        switch (keyType) {
            case keyTypes.digit:
                this.reset(keyString);
                break;
            case keyTypes.point:
                this.reset(this.display.value + keyString);
                break;
            case keyTypes.op:
                this.left = this.display.value;
                this.op = keyString;
                this.setDisplay(keyString, updateDisplayAction.append);
                this.state = states.right;
                break;
        }
    },
    calculate: function () {
        let result, left, right;
        left = parseFloat(this.left);
        right = parseFloat(this.right);
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
        this.left = withLeft;
        this.right = '';
        this.op = '';
        this.state = states.left;
        this.setDisplay(withLeft, updateDisplayAction.set);
    }
};

window.onload = function () {
    btns = document.querySelectorAll(".btn");
    displayText = document.querySelector(".form-control");
    calculator.initialize(displayText);

    for (let btn of btns) {
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