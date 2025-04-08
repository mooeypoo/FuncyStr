// const resolveFunctions = require('../src/resolveFunctions.js');
// import resolveFunctions from '../src/resolveFunctions.js';
import FuncyStr from '../src/FuncyStr.js';
import { expect } from 'chai';

const cases = [
    {
        title: 'should resolve a simple GENDER function',
        input: "This is a {{GENDER|man|woman}}.",
        params: { m: true },
        expected: "This is a man."
    }
]

describe('FuncyStr process', () => {
    const fstr = new FuncyStr({
        GENDER: (params, m, f) => (params.m ? m : f),
        PLURAL: (params, one, plural) => (params.plural ? plural : one),
    })

    
    it('should resolve a simple GENDER function', () => {
        expect(
            fstr.process(
                "This is a {{GENDER|man|woman}}.",
                { m: true }
            )
        ).to.equal("This is a man.");
    });

    it('should resolve a simple PLURAL function', () => {
        expect(
            fstr.process(
                "There is one {{PLURAL|apple|apples}}.",
                { plural: true }
            )
        ).to.equal("There is one apples.");
    });

    it('should resolve nested functions', () => {
        expect(
            fstr.process(
                "This is a {{GENDER|{{PLURAL|man|men}}|{{PLURAL|woman|women}}}}.",
                { m: true, plural: true }
            )
        ).to.equal("This is a men.");
    });

    it('should handle missing function definitions gracefully', () => {
        expect(
            fstr.process(
                "This is a {{UNKNOWN|arg1|arg2}}.",
                {}
            )
        ).to.equal("This is a {{UNKNOWN|arg1|arg2}}.");
    });

    it('should resolve multiple functions in a single string', () => {
        expect(
            fstr.process(
                "This is a {{GENDER|man|woman}} and there are {{PLURAL|one|many}}.",
                { m: false, plural: true }
            )
        ).to.equal("This is a woman and there are many.");
    });

    it('should resolve functions with no parameters', () => {
        expect(
            fstr.process(
                "This is a {{GENDER|man|woman}}.",
                {}
            )
        ).to.equal("This is a woman."); // Default to 'f' if 'm' is not provided
    });

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

    it('should return the original string if no functions are present', () => {
        expect(
            fstr.process(
                "This is a plain string.",
                { m: true, plural: false }
            )
        ).to.equal("This is a plain string.");
    });
});