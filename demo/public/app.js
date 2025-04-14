import FuncyStr from '../../src/FuncyStr.js';

// Define the functions that will be available in the demo
const demoFunctions = {
    uppercase: (params, text) => text.toUpperCase(),
    lowercase: (params, text) => text.toLowerCase(),
    reverse: (params, text) => text.split('').reverse().join(''),
    repeat: (params, text, times = 2) => text.repeat(parseInt(times)),
    length: (params, text) => text.length.toString()
};

// Initialize FuncyStr with our demo functions
const funcyStr = new FuncyStr(demoFunctions);

// Get DOM elements
const inputText = document.getElementById('input-text');
const processBtn = document.getElementById('process-btn');
const resultDiv = document.getElementById('result');
const functionCodeDiv = document.getElementById('function-code');
const toggleBtn = document.getElementById('toggle-code');
const toggleText = toggleBtn.querySelector('.toggle-text');
const functionCodeContainer = document.getElementById('function-code-container');

// Function to display the function code
function displayFunctionCode() {
    const code = Object.entries(demoFunctions)
        .map(([name, func]) => {
            const funcStr = func.toString();
            return `// ${name} function
${funcStr}`;
        })
        .join('\n\n');
    
    functionCodeDiv.textContent = code;
}

// Function to toggle the code display
function toggleCodeDisplay() {
    const isHidden = functionCodeContainer.classList.contains('hidden');
    functionCodeContainer.classList.toggle('hidden');
    toggleText.textContent = isHidden ? 'Hide' : 'Show';
}

// Add event listener to the toggle button
toggleBtn.addEventListener('click', toggleCodeDisplay);

// Add event listener to the process button
processBtn.addEventListener('click', () => {
    const input = inputText.value;
    try {
        const processed = funcyStr.process(input);
        resultDiv.innerHTML = `<p class="text-gray-800">${processed}</p>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
});

// Add some example text to the input
inputText.value = `Hello {{uppercase|world}}!
The length is {{length|Hello world}}. We can also try {{uppercase|{{reverse|detsen}} functions}}. 
This is {{repeat|so |5}} cool!`;

// Display the function code
displayFunctionCode();