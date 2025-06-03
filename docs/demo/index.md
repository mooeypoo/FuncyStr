# Interactive demo

Use this page to test `FuncyStr` features dynamically. For this demo, the following functions are included:

::: details Available functions:
* <code>&lcub;&lcub;PLURAL|singular|plural&rcub;&rcub;</code>: Choose a version for singular and plural
* <code>&lcub;&lcub;name&rcub;&rcub;</code>: Display the value of the chosen name given in `params`
* <code>&lcub;&lcub;pronoun|he|she|they&rcub;&rcub;</code>: Choose the correct version of the text for the given pronoun value in `params`
* <code>&lcub;&lcub;capitalize|text&rcub;&rcub;</code>: Capitalize the given text
* <code>&lcub;&lcub;abbr|term|desc&rcub;&rcub;</code>: Create a `<abbr>` tag with the term and description.
* <code>&lcub;&lcub;featuredwiki|year|month|day&rcub;&rcub;</code>: Outputs English Wikipedia's featured article for the given date.
:::


## Instantiation code example
This code should only serve as an example for this demo purposes only. Before using this in your app, make sure there's proper validation of inputs, especially if the code runs on the server.
```js
const fstr = new FuncyStr({
    NAME: (params) => params.name,
    PRONOUN: (params, he, she, they) => params.pronoun === 'he' ? he : params.pronoun === 'she' ? she : they,
    CAPITALIZE: (params, text) => text.charAt(0).toUpperCase() + text.slice(1),
    ABBR: (params, term, desc) => `<abbr title="${desc}">${term}</abbr>`,
    FEATUREDWIKI: async (params, year, month, day) => {
        try {
            const response = await fetch(
                `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`,
                {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'FuncyStr/v2.0interactive-demo',
                        'Content-Type': 'application/json'
                    }
                }
            );
            const json = await response.json();
            const title = json.tfa.titles.normalized
            const url = json.tfa.content_urls.desktop.page
            return `<a href="${url}">${title}</a>`
        } catch (error) {
            return '(NOT FOUND)';
        }
    }
});

```

## Interactive example

You can change and edit the textbox below to see how the system processes inputs given the commands it was given. Change the values of the pronoun select and name input to see how the system takes parameters into account.

<div class="interactive-demo">
    <div class="demo-input">
        <textarea v-model="demoInputString"></textarea>
    </div>
    <div class="demo-actions">
        <div class="demo-actions-options">
            <div class="demo-actions-options-header">Params:</div>
            <div class="demo-actions-options-inputs">
                <div>
                    Name: <input type="text" v-model="demoInputName" />
                </div>
                <div>
                    Pronoun: <select v-model="demoInputPronoun">
                        <option value="they">They</option>
                        <option value="he">He</option>
                        <option value="she">She</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="demo-actions-button">
            <button class="button" @click="runProcess"><span>👆</span> Process</button>
        </div>
    </div>
    <div class="demo-result">
        <div class="demo-result-header">String preview</div>
        <textarea disabled>{{ demoOutput }}</textarea>
    </div>
    <div class="demo-preview">
        <div class="demo-preview-header">HTML preview</div>
        <div class="demo-preview-output" v-html="demoOutput"></div>
    </div>
</div>


<script setup>
import { ref } from 'vue'
import FuncyStr from '../lib/funcystr.module.js'

const demoInputString = ref(
`{{capitalize|{{pronoun|his|her|their}}}} name is {{name}}.

{{abbr|github|a web-based platform and a code hosting service that allows developers to collaborate on projects using Git}}

Wikipedia's featured article: {{featuredwiki|2025|05|15}}`
)
const demoOutput = ref()
const demoInputName = ref('Sam')
const demoInputPronoun = ref('they')

const fstr = new FuncyStr({
    NAME: (params) => params.name,
    PRONOUN: (params, he, she, they) => params.pronoun === 'he' ? he : params.pronoun === 'she' ? she : they,
    CAPITALIZE: (params, text) => text.charAt(0).toUpperCase() + text.slice(1),
    ABBR: (params, term, desc) => `<abbr title="${desc}">${term}</abbr>`,
    FEATUREDWIKI: async (params, year, month, day) => {
        try {
            const response = await fetch(
                `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`,
                {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'FuncyStr/v2.0interactive-demo',
                        'Content-Type': 'application/json'
                    }
                }
            );
            const json = await response.json();
            const title = json.tfa.titles.normalized
            const url = json.tfa.content_urls.desktop.page
            return `<a href="${url}">${title}</a>`
        } catch (error) {
            return '(NOT FOUND)';
        }
    }
});

async function runProcess() {
    demoOutput.value = '⏳'
    demoOutput.value = await fstr.process(
        demoInputString.value,
        {
            name: demoInputName.value,
            pronoun: demoInputPronoun.value,
        }
    )
}

</script>

<style lang="scss">
.interactive-demo {
    padding: 0.5em 0;

    textarea {
        width: 100%;
        background-color: #d7dce5;
        padding: 1em;
        height: 200px;

        :root.dark & {
            background-color: #202127;
        }
    }

    .demo-input {
        textarea {
            border-radius: 1em 1em 0 0;
        }
    }

    .demo-actions {
        display: flex;
        flex-grow: 2;
        justify-content: space-around;
        align-items: flex-end;
        background-color: #8c9dba;
        font-size: 0.875em;
        padding: 0.5em;

        :root.dark & {
            background-color: #1d2f41;
        }

        &-options {
            display: flex;
            flex-direction: column;
            flex-grow: 2;
            padding-right: 0.5em;

            &-header {
                font-family: monospace;
                font-size: 0.7em;
            }

            &-inputs {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin: 0;

                input, select {
                    background-color: #93a0b5;
                    border: 1px solid #1b1b1f;
                    border-radius: 0.5em;
                    color: #1b1b1f;
                }

                input {
                    padding: 0.2em 0.5em;
                    width: 6em;
                }

                select {
                    -webkit-appearance: auto;
                    padding: 0.5em;
                }
            }
        }

        &-button {
            .button {
                background-color: #3384f9;
                padding: 0.5em;
                border-radius: 0.5em;
                color: black;

                span {
                    padding: 0.4em;
                    border-radius: 1em;
                    background-color: #272a2f;
                }

                &:hover {
                    background-color:#659be6;
                }
            }
        }

    }

    .demo-result {
        &-header {
           font-family: monospace;
            font-size: 0.7em;
        }

        textarea {
            height: 200px;
        }
    }

    .demo-preview {
        &-header {
           font-family: monospace;
            font-size: 0.7em;
        }

        &-output {
            border-radius: 0 0 1em 1em;
        }
        
    }
}
</style>