# Advanced: Asynchronous functions

As of version 2.0, funcystr allows for the use of asynchronous functions in the functions given during instantiation. This allows for more robust functionality like fetching remote assets or performing heavier calculations.

## Example: Fetching remote data

Starting from version 2.0, funcystr allows for the use of `async` functions. This opens the door for advanced features, like fetching from remote sources or performing more advanced operations.

Here is an example of fetching a search result from Wikipedia:

```js
const fstr = new FuncyStr({
    ARTICLE_NAME: (params) => params.article_name,
    SEARCHWIKI: async (params, articlename) => {
        try {
            const response = await fetch(
                `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${articlename}&limit=1`,
                {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'FuncyStr/v2.0demo',
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (!response.ok) {
                return '<NO RESULTS>';
            }
            const json = await response.json();
            return json.pages[0].title;
        } catch (error) {
            return '<ERROR>';
        }
    }
});
```

Using these functions allow us to perform remote fetches that depend on the string input:

```
const result = await fstr.process('{{SEARCHWIKI|func}}', {})
```
<button :class="$style.button" @click="runProcess('asyncWikiSearch')">Test it out!</button>

<input type="text" :class="$style.result" disabled :value="asyncWikiSearchResult" />

<script setup>
import { ref } from 'vue'
import FuncyStr from '../lib/funcystr.module.js'

const asyncWikiSearchResult = ref('Result')

async function runProcess(example) {
    const fstr = new FuncyStr({
        ARTICLE_NAME: (params) => params.article_name,
        SEARCHWIKI: async (params, articlename) => {
            try {
                const response = await fetch(
                    `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${articlename}&limit=1`,
                    {
                        method: 'GET',
                        headers: {
                            'User-Agent': 'FuncyStr/v2.0demo',
                            'Content-Type': 'application/json'
                        }
                    }
                );
                if (!response.ok) {
                    return '<NO RESULTS>';
                }
                const json = await response.json();
                return json.pages[0].title;
            } catch (error) {
                return '<ERROR>';
            }
        }
    });

    if (example === 'asyncWikiSearch') {
        asyncWikiSearchResult.value = '⏳'
        asyncWikiSearchResult.value = await fstr.process('{{SEARCHWIKI|func}}', {})
    }
}
</script>

<style module>
.button {
    background-color: #3384f9;
    /* font-weight: bold; */
    padding: 0.5em;
    border-radius: 0.5em;
    color: black;
}

.result {
    font-family: monospace;
    background-color: #161618;
    color: #b6c0c1;
    padding: 0.5em 1em;
    border-radius: 0.5em;
    width: 100%;
}
</style>