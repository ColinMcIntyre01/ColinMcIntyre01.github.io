// Calculator state
const calculatorState = {
    currentValue: '0',
    expression: '',
    result: '0',
    memory: 0,
    isMemorySet: false,
    lastOperation: null,
    history: []
};

// DOM elements
const displayExpression = document.getElementById('expression');
const displayResult = document.getElementById('result');
const memoryIndicator = document.getElementById('memory-indicator');
const historyContainer = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clear-history');

// Initialize calculator
function initCalculator() {
    updateDisplay();
    updateMemoryIndicator();
    loadHistoryFromStorage();
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', handleButtonClick);
    });
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyPress);
    
    // Clear history button
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Handle button clicks
function handleButtonClick(event) {
    const button = event.currentTarget;
    const value = button.getAttribute('data-value');
    const action = button.getAttribute('data-action');
    
    if (value !== null) {
        inputNumber(value);
    } else if (action !== null) {
        handleAction(action);
    }
    
    updateDisplay();
}

// Handle keyboard input
function handleKeyPress(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (/[0-9.]/.test(key)) {
        inputNumber(key);
    }
    // Basic operations
    else if (['+', '-', '*', '/', '%'].includes(key)) {
        handleAction(key === '*' ? 'multiply' : 
                    key === '/' ? 'divide' : 
                    key === '%' ? 'percent' : 
                    key);
    }
    // Equals or Enter
    else if (key === '=' || key === 'Enter') {
        handleAction('equals');
        event.preventDefault();
    }
    // Escape or Delete for clear
    else if (key === 'Escape' || key === 'Delete') {
        handleAction('clear');
    }
    // Backspace
    else if (key === 'Backspace') {
        handleAction('backspace');
    }
    // Pi constant
    else if (key === 'p' || key === 'P') {
        handleAction('pi');
    }
    // Euler's number
    else if (key === 'e' || key === 'E') {
        handleAction('e');
    }
    
    updateDisplay();
}

// Input number or decimal point
function inputNumber(num) {
    if (calculatorState.currentValue === '0' || calculatorState.lastOperation === 'equals') {
        calculatorState.currentValue = num;
        calculatorState.lastOperation = null;
    } else {
        // Prevent multiple decimal points
        if (num === '.' && calculatorState.currentValue.includes('.')) {
            return;
        }
        calculatorState.currentValue += num;
    }
    
    // Update expression if we're not in the middle of a calculation
    if (!calculatorState.expression.includes('=')) {
        calculatorState.expression = calculatorState.currentValue;
    }
}

// Handle calculator actions
function handleAction(action) {
    switch (action) {
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            handleOperation(action);
            break;
            
        case 'equals':
            calculateResult();
            break;
            
        case 'clear':
            calculatorState.currentValue = '0';
            calculatorState.expression = '';
            calculatorState.result = '0';
            break;
            
        case 'clear-entry':
            calculatorState.currentValue = '0';
            calculatorState.expression = calculatorState.expression.slice(0, -calculatorState.currentValue.length);
            break;
            
        case 'backspace':
            if (calculatorState.currentValue.length > 1) {
                calculatorState.currentValue = calculatorState.currentValue.slice(0, -1);
            } else {
                calculatorState.currentValue = '0';
            }
            break;
            
        case 'toggle-sign':
            calculatorState.currentValue = String(-parseFloat(calculatorState.currentValue));
            break;
            
        case 'percent':
            calculatorState.currentValue = String(parseFloat(calculatorState.currentValue) / 100);
            break;
            
        case 'reciprocal':
            calculatorState.currentValue = String(1 / parseFloat(calculatorState.currentValue));
            break;
            
        case 'sqrt':
            calculatorState.currentValue = String(Math.sqrt(parseFloat(calculatorState.currentValue)));
            break;
            
        case 'pow2':
            calculatorState.currentValue = String(Math.pow(parseFloat(calculatorState.currentValue), 2));
            break;
            
        case 'pow3':
            calculatorState.currentValue = String(Math.pow(parseFloat(calculatorState.currentValue), 3));
            break;
            
        case 'pow':
            calculatorState.expression = calculatorState.currentValue + '^';
            calculatorState.lastOperation = 'pow';
            break;
            
        case 'pow10':
            calculatorState.currentValue = String(Math.pow(10, parseFloat(calculatorState.currentValue)));
            break;
            
        case 'factorial':
            calculatorState.currentValue = String(factorial(parseInt(calculatorState.currentValue)));
            break;
            
        case 'sin':
            calculatorState.currentValue = String(Math.sin(degreesToRadians(parseFloat(calculatorState.currentValue))));
            break;
            
        case 'cos':
            calculatorState.currentValue = String(Math.cos(degreesToRadians(parseFloat(calculatorState.currentValue))));
            break;
            
        case 'tan':
            calculatorState.currentValue = String(Math.tan(degreesToRadians(parseFloat(calculatorState.currentValue))));
            break;
            
        case 'asin':
            calculatorState.currentValue = String(radiansToDegrees(Math.asin(parseFloat(calculatorState.currentValue))));
            break;
            
        case 'acos':
            calculatorState.currentValue = String(radiansToDegrees(Math.acos(parseFloat(calculatorState.currentValue))));
            break;
            
        case 'atan':
            calculatorState.currentValue = String(radiansToDegrees(Math.atan(parseFloat(calculatorState.currentValue))));
            break;
            
        case 'log':
            calculatorState.currentValue = String(Math.log10(parseFloat(calculatorState.currentValue)));
            break;
            
        case 'ln':
            calculatorState.currentValue = String(Math.log(parseFloat(calculatorState.currentValue)));
            break;
            
        case 'log2':
            calculatorState.currentValue = String(Math.log2(parseFloat(calculatorState.currentValue)));
            break;
            
        case 'exp':
            calculatorState.currentValue = String(Math.exp(parseFloat(calculatorState.currentValue)));
            break;
            
        case 'abs':
            calculatorState.currentValue = String(Math.abs(parseFloat(calculatorState.currentValue)));
            break;
            
        case 'pi':
            calculatorState.currentValue = String(Math.PI);
            break;
            
        case 'e':
            calculatorState.currentValue = String(Math.E);
            break;
            
        // Memory functions
        case 'memory-clear':
            calculatorState.memory = 0;
            calculatorState.isMemorySet = false;
            updateMemoryIndicator();
            break;
            
        case 'memory-recall':
            calculatorState.currentValue = String(calculatorState.memory);
            break;
            
        case 'memory-add':
            calculatorState.memory += parseFloat(calculatorState.currentValue);
            calculatorState.isMemorySet = true;
            updateMemoryIndicator();
            break;
            
        case 'memory-subtract':
            calculatorState.memory -= parseFloat(calculatorState.currentValue);
            calculatorState.isMemorySet = true;
            updateMemoryIndicator();
            break;
    }
}

// Handle basic operations
function handleOperation(op) {
    const opSymbols = {
        'add': '+',
        'subtract': '-',
        'multiply': '×',
        'divide': '÷'
    };
    
    calculatorState.expression = calculatorState.currentValue + ' ' + opSymbols[op] + ' ';
    calculatorState.lastOperation = op;
}

// Calculate the final result
function calculateResult() {
    try {
        // Parse the expression
        let expr = calculatorState.expression;
        
        // Replace display symbols with calculation symbols
        expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');
        
        // Handle power operation
        if (calculatorState.lastOperation === 'pow') {
            expr = calculatorState.expression.replace('^', '') + calculatorState.currentValue;
            expr = expr.replace('^', '**');
        } else {
            expr += calculatorState.currentValue;
        }
        
        // Evaluate the expression safely
        let result;
        if (expr.includes('**')) {
            // Handle power operation
            const parts = expr.split('**');
            if (parts.length === 2) {
                result = Math.pow(parseFloat(parts[0]), parseFloat(parts[1]));
            } else {
                throw new Error('Invalid expression');
            }
        } else {
            // Use Function constructor for safe evaluation
            result = Function('"use strict"; return (' + expr + ')')();
        }
        
        // Check for valid result
        if (isNaN(result) || !isFinite(result)) {
            throw new Error('Invalid calculation');
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        calculatorState.result = String(result);
        calculatorState.expression += calculatorState.currentValue + ' =';
        
        // Add to history
        addToHistory(calculatorState.expression, calculatorState.result);
        
        // Reset for next calculation
        calculatorState.currentValue = calculatorState.result;
        calculatorState.lastOperation = 'equals';
        
    } catch (error) {
        calculatorState.result = 'Error';
        calculatorState.currentValue = '0';
    }
}

// Helper functions
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Update display
function updateDisplay() {
    displayExpression.textContent = calculatorState.expression || '0';
    displayResult.textContent = calculatorState.currentValue;
}

// Memory indicator
function updateMemoryIndicator() {
    if (calculatorState.isMemorySet) {
        memoryIndicator.textContent = calculatorState.memory;
        memoryIndicator.style.color = '#4cc9f0';
    } else {
        memoryIndicator.textContent = 'Empty';
        memoryIndicator.style.color = '#888';
    }
}

// History functions
function addToHistory(expression, result) {
    const historyItem = {
        expression,
        result,
        timestamp: new Date().toLocaleTimeString()
    };
    
    calculatorState.history.unshift(historyItem);
    
    // Keep only last 10 items
    if (calculatorState.history.length > 10) {
        calculatorState.history.pop();
    }
    
    updateHistoryDisplay();
    saveHistoryToStorage();
}

function updateHistoryDisplay() {
    historyContainer.innerHTML = '';
    
    if (calculatorState.history.length === 0) {
        historyContainer.innerHTML = '<div class="history-empty">No calculations yet</div>';
        return;
    }
    
    calculatorState.history.forEach(item => {
        const historyElement = document.createElement('div');
        historyElement.className = 'history-item';
        historyElement.innerHTML = `
            <div class="history-expression">${item.expression}</div>
            <div class="history-result">${item.result}</div>
            <div class="history-timestamp">${item.timestamp}</div>
        `;
        historyContainer.appendChild(historyElement);
    });
}

function clearHistory() {
    calculatorState.history = [];
    updateHistoryDisplay();
    localStorage.removeItem('calculatorHistory');
}

function saveHistoryToStorage() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculatorState.history));
}

function loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        calculatorState.history = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', initCalculator);