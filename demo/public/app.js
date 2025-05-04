import FuncyStr from './lib/funcystr.module.js';

// Define the functions that will be available in the demo
const demoFuncs = {
    uppercase: (params, text) => text.toUpperCase(),
    repeat: (params, text, times = 2) => text.repeat(parseInt(times)),
    length: (params, text) => text.length.toString(),
    gender: (params, he, she, they) => {
        return params.gender === 'he' ? he : params.gender === 'she' ? she : they;
    }
};

// Initialize FuncyStr with our demo functions
const funcyStr = new FuncyStr(demoFuncs);

// Get DOM elements
const inputText = document.getElementById('input-text');
const processBtn = document.getElementById('process-btn');
const resultDiv = document.getElementById('result');
// const functionCodeDiv = document.getElementById('function-code');
const toggleBtn = document.getElementById('toggle-code');
const toggleText = toggleBtn.querySelector('.toggle-text');
const functionCodeContainer = document.getElementById('function-code-container');
const pronounSet = document.getElementById('pronoun-set');

// Function to display the function code
// function displayFunctionCode() {
//     const code = Object.entries(demoFuncs)
//         .map(([name, func]) => {
//             const funcStr = func.toString();
//             return `// ${name} function
// ${funcStr}`;
//         })
//         .join('\n\n');
    
//     functionCodeDiv.textContent = code;
// }

// Function to toggle the code display
function toggleCodeDisplay() {
    const isHidden = functionCodeContainer.classList.contains('hidden');
    functionCodeContainer.classList.toggle('hidden');
    toggleText.textContent = isHidden ? 'Hide' : 'Show';
}

// Add event listener to the toggle button
toggleBtn.addEventListener('click', toggleCodeDisplay);

// Function to process text when pronoun set changes
function updateResult() {
    const input = inputText.value;
    try {
        const processed = funcyStr.process(input, { gender: pronounSet.value });
        resultDiv.innerHTML = `<p class="text-gray-800">${processed}</p>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
}

// Add event listener to the pronoun selector
pronounSet.addEventListener('change', updateResult);

// Add event listener to the process button
processBtn.addEventListener('click', () => {
    const input = inputText.value;
    try {
        const processed = funcyStr.process(input, { gender: pronounSet.value });
        resultDiv.innerHTML = `<p class="text-gray-800">${processed}</p>`;
    } catch (error) {
        resultDiv.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
});

// Update the example text to include pronouns
inputText.value = `Hello {{uppercase|world}}!
The length of "Hello World" is {{length|Hello world}}. 
We can also try {{uppercase|{{repeat|nested| 2}} functions}}!

And here is a sentence using pronouns with gendered language:

{{gender|He|She|They}} went to the store and bought {{gender|himself|herself|themselves}} groceries and carried them home.`;

// Display the function code
// displayFunctionCode();