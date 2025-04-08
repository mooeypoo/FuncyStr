class FuncyStr {
    #funcs = {}
    #regexlookup = /{{([^{}\v]+)}}/;

    constructor(funcs = {}, config = {}) {
        this.setFuncs(funcs)
        this.#regexlookup = config.regexlookup || this.#regexlookup
    }

    addFunc(name, func) {
        if (typeof func !== 'function') {
            throw new Error('func must be a function')
        }
        this.#funcs[name] = func
    }

    setFuncs(funcs) {
        if (typeof funcs !== 'object') {
            throw new Error('funcs must be an object')
        }

        // Check if all values in the object are functions
        for (const name in funcs) {
            this.addFunc(name, funcs[name])
        }
    }

    getFunc(name) {
        return this.#funcs[name]
    }

    #runFunc(name, args, params) {
        if (typeof this.getFunc(name) === 'function') {
            return this.#funcs[name](params, ...args)
        }
    }

    #evaluateFunction(str, params) {
        const innerMatch = str.match(this.#regexlookup);
        if (!innerMatch) return str;

        const funcString = innerMatch[1];
        if (funcString.includes('{{')) {
            // If there are nested functions, resolve them first
            return this.process.call(this, funcString, params);
        }
        const [funcName, ...args] = funcString.split('|');

        // Call the corresponding function from the function map
        if (this.#funcs[funcName]) {
            return this.#runFunc.call(this, funcName, args, params)
        }

        // If function isn't found, we want to return the original
        // however, if we do that, the loop looking for {{...}} will
        // never end. So, we cheat here. If there is no match, instead
        // of returning the original, we will replace {{ }} with another
        // set of symbols; then, at the completion of the entire process,
        // we will replace those symbols with the original {{ }}.
        // This way, we can break the loop and return the original
        // matches when the function isn't recognized.
        return innerMatch[0] // <-- innerMatch[0] is the entire match including {{ and }}
            .replace('{{', '%%open%%brack%%')
            .replace('}}', '%%close%%brack%%');
    }

    process(str, params) {
        // Replace all functions in the string recursively
        while (str.match(this.#regexlookup)) {
            str = str.replace(this.#regexlookup, this.#evaluateFunction.apply(this, [str, params]));
        }
    
        // Replace the temporary markers with the original {{ }} and return
        return str
            .replace(/%%open%%brack%%/g, '{{')
            .replace(/%%close%%brack%%/g, '}}');
    }
}

export default FuncyStr