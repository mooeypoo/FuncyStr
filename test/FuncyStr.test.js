// const resolveFunctions = require('../src/resolveFunctions.js');
// import resolveFunctions from '../src/resolveFunctions.js';
import FuncyStr from '../src/FuncyStr.js';
import { expect } from 'chai';

const cases = [
    {
        name: 'should resolve a simple GENDER function',
        test: {
            input: 'This is a {{GENDER|man|woman}}.',
            params: { m: true }
        },
        result: "This is a man."
    },
    {
        name: 'should resolve a simple PLURAL function',
        test: {
            input: 'There is one {{PLURAL|apple|apples}}.',
            params: { plural: true }
        },
        result: "There is one apples."
    },
    {
        name: 'should resolve a replacement function that takes no inline values (CHAR_NAME)',
        test: {
            input: 'Hello, {{CHAR_NAME}}.',
            params: { char_name: 'John' }
        },
        result: "Hello, John."
    },
    {
        name: 'should resolve multiple and nested functions',
        test: {
            input: 'We see that {{PLURAL|this is|these are}} {{GENDER|{{PLURAL|a man|men}}|{{PLURAL|a woman|women}}}}.',
            params: { m: true, plural: true }
        },
        result: 'We see that these are men.'
    },
    {
        name: 'should handle missing function definitions gracefully',
        test: {
            input: 'This is a {{UNKNOWN|arg1|arg2}}.',
            params: {}
        },
        result: 'This is a {{UNKNOWN|arg1|arg2}}.'
    },
    {
        name: 'should handle missing function definitions gracefully',
        test: {
            input: 'This is a nested {{PLURAL|{{UNKNOWN|arg1|arg2}}|plural}}.',
            params: { plural: false }
        },
        result: 'This is a nested {{UNKNOWN|arg1|arg2}}.'
    },
    {
        name: 'should handle empty strings',
        test: {
            input: '',
            params: {}
        },
        result: ''
    },
    {
        name: 'should handle strings without functions',
        test: {
            input: 'This is a plain string.',
            params: {}
        },
        result: 'This is a plain string.'
    },
    {
        name: 'should resolve multiple functions in a single string.',
        test: {
            input: 'This is a {{GENDER|man|woman}} and there are {{PLURAL|one|many}}.',
            params: { m: false, plural: true }
        },
        result: 'This is a woman and there are many.'
    },
    {
        name: 'should resolve functions with no parameters',
        test: {
            input: 'This is a {{GENDER|man|woman}}.',
            params: {}
        },
        result: 'This is a woman.' // Default to 'f' if 'm' is not true
    },
    {
        name: 'should resolve function that outputs unbalanced brackets',
        test: {
            input: 'This is a {{BRACKOUTPUT}}string.',
            params: {}
        },
        result: 'This is a {{string.'
    },
    {
        name: 'should resolve function that outputs unbalanced brackets',
        test: {
            input: 'This is a {{BRACKOUTPUTEND}}string.',
            params: {}
        },
        result: 'This is a }}string.'
    },
    {
        name: 'should resolve functions that output another function',
        test: {
            input: 'This is a {{OUTPUTFUNC}}.',
            params: { m: true, plural: true }
        },
        result: 'This is a men.'
    },
    {
        name: 'should ignore single brackets',
        test: {
            input: 'This is a {GENDER|man|woman}.',
            params: { m: true }
        },
        result: 'This is a {GENDER|man|woman}.'
    },
    {
        name: 'should ignore single brackets in parameters',
        test: {
            input: 'This is a {{GENDER|man{he}|woman{she}}}.',
            params: { m: false }
        },
        result: 'This is a woman{she}.'
    },
    {
        name: 'should resolve function that outputs unbalanced brackets within other functions',
        test: {
            input: 'This is a {{PLURAL|{{BRACKOUTPUTEND}}|many}} string.',
            params: { plural: true }
        },
        result: 'This is a many string.'
    },
    {
        name: 'should resolve function that outputs unbalanced brackets within other functions, and keep the unbalanced brackets',
        test: {
            input: 'This is a {{PLURAL|{{BRACKOUTPUTEND}}|many}} string.',
            params: { plural: false }
        },
        result: 'This is a }} string.'
    }
]

describe('FuncyStr process', () => {
    const fstr = new FuncyStr({
        GENDER: (params, m, f) => (params.m ? m : f),
        PLURAL: (params, one, plural) => (params.plural ? plural : one),
        CHAR_NAME: (params) => params.char_name,
        BRACKOUTPUT: (params) => '{{',
        BRACKOUTPUTEND: (params) => '}}',
        OUTPUTFUNC: (params) => {
            return params.m ? '{{PLURAL|man|men}}' : '{{PLURAL|woman|women}}';
        }
    })

    // Loop through the test cases and run each one
    cases.forEach(({ name, test, result }) => {
        it(name, () => {
            const { input, params } = test;
            expect(fstr.process(input, params)).to.equal(result);
        });
    });

    // Special case for deeply nested functions
    it('should resolve deeply nested functions', () => {
        const input = "This is a {{PLURAL|{{GENDER|{{PLURAL|man|men}}|{{PLURAL|woman|women}}}}|people}}.";
        expect(
            fstr.process(
                input,
                { m: false, plural: false }
            )
        ).to.equal("This is a woman.");

        expect(
            fstr.process(
                input,
                { m: false, plural: true }
            )
        ).to.equal("This is a people.");

        expect(
            fstr.process(
                input,
                { m: true, plural: false }
            )
        ).to.equal("This is a man.");
    });
});


describe('FuncyStr process demo string', () => {
    it('should resolve the demo string', () => {
        const str = `Hello, {{uppercase|world}}!
            The length is {{length|Hello world}}. We can also try {{uppercase|{{reverse|detsen}} functions}}.
            This is {{UPPERCASE|{{NOTRECOGNIZED|one|two}}}}
            This is {{repeat|so |5}}cool!
            {{gender|He|She|They}} went to the store and bought {{gender|himself|herself|themselves}} groceries and carried them home.`;
        const fstr = new FuncyStr({
            GENDER: (params, he, she, they) => params.gender === 'he' ? he : params.gender === 'she' ? she : they,
            UPPERCASE: (params, text) => text.toUpperCase(),
            LENGTH: (params, text) => text.length.toString(),
            REVERSE: (params, text) => text.split('').reverse().join(''),
            REPEAT: (params, text, times) => text.repeat(parseInt(times)),
        });

        expect(fstr.process(str, { gender: 'they' })).to.equal(
            `Hello, WORLD!
            The length is 11. We can also try NESTED FUNCTIONS.
            This is {{NOTRECOGNIZED|ONE|TWO}}
            This is so so so so so cool!
            They went to the store and bought themselves groceries and carried them home.`
        );

        expect(fstr.process(str, { gender: 'she' })).to.equal(
            `Hello, WORLD!
            The length is 11. We can also try NESTED FUNCTIONS.
            This is {{NOTRECOGNIZED|ONE|TWO}}
            This is so so so so so cool!
            She went to the store and bought herself groceries and carried them home.`
        );
    });
});
