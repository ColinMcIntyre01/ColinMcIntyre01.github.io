<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scientific Calculator</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-calculator"></i> Scientific Calculator</h1>
            <p class="subtitle">Advanced calculator with scientific functions</p>
        </header>
        
        <main>
            <div class="calculator-wrapper">
                <!-- Display Section -->
                <div class="display">
                    <div class="expression-display" id="expression">0</div>
                    <div class="result-display" id="result">0</div>
                </div>
                
                <!-- Calculator Buttons -->
                <div class="buttons">
                    <!-- First row: Memory and Clear functions -->
                    <button class="btn func" data-action="clear" title="Clear all">C</button>
                    <button class="btn func" data-action="clear-entry" title="Clear entry">CE</button>
                    <button class="btn func" data-action="backspace" title="Backspace"><i class="fas fa-backspace"></i></button>
                    <button class="btn func" data-action="memory-clear" title="Memory clear">MC</button>
                    <button class="btn func" data-action="memory-recall" title="Memory recall">MR</button>
                    <button class="btn func" data-action="memory-add" title="Memory add">M+</button>
                    <button class="btn func" data-action="memory-subtract" title="Memory subtract">M-</button>
                    
                    <!-- Second row: Trigonometric functions -->
                    <button class="btn sci" data-action="sin">sin</button>
                    <button class="btn sci" data-action="cos">cos</button>
                    <button class="btn sci" data-action="tan">tan</button>
                    <button class="btn sci" data-action="log" title="Logarithm base 10">log</button>
                    <button class="btn sci" data-action="ln" title="Natural logarithm">ln</button>
                    <button class="btn sci" data-action="sqrt" title="Square root">√</button>
                    <button class="btn sci" data-action="pow" title="Power">x^y</button>
                    <button class="btn sci" data-action="factorial" title="Factorial">x!</button>
                    
                    <!-- Third row: Numbers and basic operations -->
                    <button class="btn sci" data-action="pi" title="Pi constant">π</button>
                    <button class="btn sci" data-action="e" title="Euler's number">e</button>
                    <button class="btn" data-value="7">7</button>
                    <button class="btn" data-value="8">8</button>
                    <button class="btn" data-value="9">9</button>
                    <button class="btn op" data-action="divide">/</button>
                    <button class="btn op" data-action="percent">%</button>
                    
                    <!-- Fourth row -->
                    <button class="btn sci" data-action="asin" title="Arcsine">sin⁻¹</button>
                    <button class="btn sci" data-action="acos" title="Arccosine">cos⁻¹</button>
                    <button class="btn sci" data-action="atan" title="Arctangent">tan⁻¹</button>
                    <button class="btn" data-value="4">4</button>
                    <button class="btn" data-value="5">5</button>
                    <button class="btn" data-value="6">6</button>
                    <button class="btn op" data-action="multiply">×</button>
                    <button class="btn op" data-action="reciprocal" title="Reciprocal">1/x</button>
                    
                    <!-- Fifth row -->
                    <button class="btn sci" data-action="pow2" title="Square">x²</button>
                    <button class="btn sci" data-action="pow3" title="Cube">x³</button>
                    <button class="btn sci" data-action="pow10" title="10^x">10^x</button>
                    <button class="btn" data-value="1">1</button>
                    <button class="btn" data-value="2">2</button>
                    <button class="btn" data-value="3">3</button>
                    <button class="btn op" data-action="subtract">-</button>
                    <button class="btn equals" data-action="equals" rowspan="2">=</button>
                    
                    <!-- Sixth row -->
                    <button class="btn sci" data-action="exp" title="Exponential">exp</button>
                    <button class="btn sci" data-action="abs" title="Absolute value">|x|</button>
                    <button class="btn sci" data-action="log2" title="Logarithm base 2">log₂</button>
                    <button class="btn" data-value="0">0</button>
                    <button class="btn" data-value=".">.</button>
                    <button class="btn" data-action="toggle-sign">±</button>
                    <button class="btn op" data-action="add">+</button>
                </div>
                
                <!-- Calculator Info -->
                <div class="calculator-info">
                    <div class="memory-status">
                        <span>Memory: <span id="memory-indicator">Empty</span></span>
                    </div>
                    <div class="hint">
                        <i class="fas fa-lightbulb"></i> Hint: Use keyboard shortcuts for faster calculations
                    </div>
                </div>
            </div>
            
            <!-- History Section -->
            <div class="history-section">
                <h3><i class="fas fa-history"></i> Calculation History</h3>
                <div class="history-list" id="history">
                    <!-- History items will be added here by JavaScript -->
                    <div class="history-empty">No calculations yet</div>
                </div>
                <button class="btn-clear-history" id="clear-history">Clear History</button>
            </div>
        </main>
        
        <footer>
            <p>Scientific Calculator &copy; <?php echo date('Y'); ?> | Created with PHP, JavaScript, HTML & CSS</p>
            <p class="server-info">
                Server Time: <?php echo date('H:i:s'); ?> | 
                PHP Version: <?php echo phpversion(); ?>
            </p>
        </footer>
    </div>
    
    <script src="script.js"></script>
</body>
</html>