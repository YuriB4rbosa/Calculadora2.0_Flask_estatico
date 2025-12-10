// Engine de cálculo segura
function safeEval(expression) {
    try {
        
        let expr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, 'Math.PI')
            .replace(/e/g, 'Math.E')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/\^/g, '**')
            .replace(/pow\(/g, 'Math.pow(');
        
        
        const funcRegex = /(sqrt|sin|cos|tan|log|ln|pow)\([^)]*$/;
        if (funcRegex.test(expr)) {
            expr += ')';
        }
        
        
        const result = Function('"use strict"; return (' + expr + ')')();
        
        
        if (typeof result === 'number') {
            
            if (!isFinite(result)) {
                throw new Error('Resultado não é um número finito');
            }
            
            
            if (result.toString().length > 12) {
                return Number(result.toFixed(10));
            }
            return result;
        }
        
        return result;
    } catch (error) {
        console.error('Erro no cálculo:', error);
        throw new Error('Expressão inválida');
    }
}

let expression = '0';
let history = [];

function updateDisplay() {
    document.getElementById('expression').textContent = expression;
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = history.map(item => 
        `<div class="history-item">${item}</div>`
    ).join('');
}

function appendToDisplay(value) {
    if (expression === '0' && value !== '.') {
        expression = value;
    } else {
        expression += value;
    }
    updateDisplay();
}

function appendFunction(func) {
    
    if (func.includes('(')) {
        expression += func;
    } else {
        expression += func + '(';
    }
    updateDisplay();
}

function appendConstant(constant) {
    if (expression === '0') {
        expression = constant;
    } else {
        expression += constant;
    }
    updateDisplay();
}

function clearDisplay() {
    expression = '0';
    document.getElementById('result').textContent = '0';
    updateDisplay();
}

function backspace() {
    if (expression.length > 1) {
        expression = expression.slice(0, -1);
    } else {
        expression = '0';
    }
    updateDisplay();
}

function calculate() {
    if (expression === '0') return;
    
    try {
        
        const result = safeEval(expression);
        
        
        document.getElementById('result').textContent = result;
        
        
        history.unshift(`${expression} = ${result}`);
        if (history.length > 5) history.pop();
        updateHistory();
        
        
        expression = result.toString();
        
        updateDisplay();
    } catch (error) {
        document.getElementById('result').textContent = 'Erro';
        expression = '0';
        updateDisplay();
    }
}


document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'p' && event.ctrlKey) {
        event.preventDefault();
        appendConstant('π');
    } else if (key === 's' && event.ctrlKey) {
        event.preventDefault();
        appendFunction('sqrt(');
    }
});


function setupButtonListeners() {
    
    for (let i = 0; i <= 9; i++) {
        const btn = document.querySelector(`button[onclick="appendToDisplay('${i}')"]`);
        if (btn) {
            btn.onclick = () => appendToDisplay(i.toString());
        }
    }
    
    
    const operators = {
        '+': () => appendToDisplay('+'),
        '-': () => appendToDisplay('-'),
        '×': () => appendToDisplay('×'),
        '÷': () => appendToDisplay('÷'),
        '.': () => appendToDisplay('.'),
        '(': () => appendToDisplay('('),
        ')': () => appendToDisplay(')')
    };
    
    Object.keys(operators).forEach(op => {
        const btn = document.querySelector(`button[onclick*="appendToDisplay('${op}')"]`);
        if (btn) btn.onclick = operators[op];
    });
    
    
    const functions = {
        'sqrt(': () => appendFunction('sqrt('),
        'sin(': () => appendFunction('sin('),
        'cos(': () => appendFunction('cos('),
        'tan(': () => appendFunction('tan('),
        'log(': () => appendFunction('log('),
        'ln(': () => appendFunction('ln('),
        'pow(': () => appendFunction('pow(')
    };
    
    
    const constants = {
        'π': () => appendConstant('π'),
        'e': () => appendConstant('e')
    };
    
    
    document.querySelector('button[onclick="clearDisplay()"]').onclick = clearDisplay;
    document.querySelector('button[onclick="backspace()"]').onclick = backspace;
    document.querySelector('button[onclick="calculate()"]').onclick = calculate;
}


document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    setupButtonListeners();
});