/**
 * FuncyStr - A utility class for processing strings with embedded function calls.
 *
 * Replaces patterns like {{functionName|arg1|arg2}} with the result of
 * calling the specified function.
 *
 * @author Moriel Schottlender <mooeypoo@gmail.com>
 * @license MIT
 */
class FuncyStr {
    #funcs = {}
    #regexlookup = /{{([^{}\v]+)}}/;

    /**
     * Creates a new FuncyStr instance.
     *
     * @param {Object} funcs - An object mapping function names to their implementations.
     * @param {Object} config - Configuration options.
     * @param {RegExp} [config.regexlookup] - Custom regex pattern for matching function calls.
     */
    constructor(funcs = {}, config = {}) {
        this.setFuncs(funcs)
        this.#regexlookup = config.regexlookup || this.#regexlookup
    }

    /**
     * Adds a single function to the function registry.
     *
     * @param {string} name - The name of the function to add.
     * @param {Function} func - The function implementation to add.
     * @throws {Error} If func is not a function.
     */
    addFunc(name, func) {
        if (typeof func !== 'function') {
            throw new Error('func must be a function')
        }
        this.#funcs[name.toLowerCase()] = func
    }

    /**
     * Sets multiple functions in the function registry.
     *
     * @param {Object} funcs - An object mapping function names to their implementations.
     * @throws {Error} If funcs is not an object.
     */
    setFuncs(funcs) {
        if (typeof funcs !== 'object') {
            throw new Error('funcs must be an object')
        }

        // Check if all values in the object are functions
        for (const name in funcs) {
            this.addFunc(name, funcs[name])
        }
    }

    /**
     * Retrieves a function from the registry by name.
     *
     * @param {string} name - The name of the function to retrieve.
     * @returns {Function|undefined} The function implementation or undefined if not found.
     */
    getFunc(name, args, params) {
        return this.#funcs[name.toLowerCase()]
    }

    /**
     * Executes a registered function with the given arguments.
     *
     * @private
     * @param {string} name - The name of the function to run.
     * @param {Array} args - Arguments to pass to the function.
     * @param {*} params - Context object passed as the first parameter to the function.
     * @returns {*} The result of the function call.
     */
    async #runFunc(name, args, params) {
        name = name.toLowerCase()
        if (typeof this.getFunc(name) === 'function') {
            return await this.getFunc(name)(params, ...args)
        }
    }

    /**
     * Evaluates a function call embedded in a string.
     *
     * @private
     * @param {string} str - The string containing the function call.
     * @param {*} params - Context object passed to the function.
     * @returns {string} The result of the function call or a placeholder if the function doesn't exist.
     */
    async #evaluateFunction(str, params) {
        const innerMatch = str.match(this.#regexlookup);
        if (!innerMatch) return str;

        const funcString = innerMatch[1];
        if (funcString.includes('{{')) {
            // If there are nested functions, resolve them first
            return await this.process.call(this, funcString, params);
        }
        const [funcName, ...args] = funcString.split('|');

        // Call the corresponding function from the function map
        if (this.#funcs[funcName.toLowerCase()]) {
            const funcResult = await this.#runFunc.call(this, funcName, args, params)

            // If the internal result of the function passes the regex
            // lookup, we want to keep it so it can then be processed.
            if (funcResult && funcResult.match(this.#regexlookup)) {
                return funcResult;
            }
            // ...But if it doesn't, we need to replace { and } with placeholders
            // so we avoid having unbalanced brackets in the string.
            return this.#replaceWithPlaceholders(funcResult)
        }

        // If function isn't found, we want to return the original
        // however, if we do that, the loop looking for {{...}} will
        // never end. So, we cheat here. If there is no match, instead
        // of returning the original, we will replace {{ }} with another
        // set of symbols; then, at the completion of the entire process,
        // we will replace those symbols with the original {{ }}.
        // This way, we can break the loop and return the original
        // matches when the function isn't recognized.
        return this.#replaceWithPlaceholders(innerMatch[0]) // <-- innerMatch[0] is the entire match including {{ and }}
    }

    #replaceWithPlaceholders(str, replacePipes = true) {
        if (!str) return
        // Replace single brackets and pipes with a placeholder
        return str
            .replaceAll('{', '%%open%%brack%%')
            .replaceAll('}', '%%close%%brack%%')
            .replaceAll('|', '%%pipe%%');
    }

    #replaceSingleBrackets(str) {
        if (!str) return
        // Replace single brackets only with a placeholder
        return str
            .replaceAll('{', '%%open%%brack%%')
            .replaceAll('}', '%%close%%brack%%')
    }

    #restorePlaceholders(str) {
        // Restore single brackets from the placeholder regardless of case
        return str
            .replace(/%%open%%brack%%/ig, '{')
            .replaceAll(/%%close%%brack%%/ig, '}')
            .replaceAll(/%%pipe%%/ig, '|')
    }

    /**
     * Processes a string by evaluating all function calls within it.
     * Recursively processes nested function calls.
     *
     * @param {string} str - The string to process.
     * @param {*} params - Context object passed to all functions.
     * @returns {string} The processed string with all function calls evaluated.
     */
    async process(str, params) {
        // Prepare the string by replacing single brackets
        // that are not part of a pair
        str = str
            .replaceAll(/(?:[^{])({)(?:[^{])/g, this.#replaceSingleBrackets)
            .replaceAll(/(?:[^}])(})(?:[^}])/g, this.#replaceSingleBrackets);

        // Replace all functions in the string recursively
        while (str.match(this.#regexlookup)) {
            const newstr = await this.#evaluateFunction.apply(this, [str, params])
            str = str.replace(this.#regexlookup, newstr);
        }

        // Replace the temporary markers with the original {{ }} and return
        return this.#restorePlaceholders(str)
    }
}

export default FuncyStr