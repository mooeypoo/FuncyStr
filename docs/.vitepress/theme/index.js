import DefaultTheme from 'vitepress/theme'
// import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // enhanceAppWithTabs(app)
    // register custom global components
    // app.component('OutputContainer', OutputContainer)
  }
}