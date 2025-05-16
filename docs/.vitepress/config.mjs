import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FuncyStr",
  description: "A lightweight JavaScript library for dynamic string processing",
  base: '/funcystr/',  // Use the repository name as the base path
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Try it out!', link: '/demo/' },
      { text: 'GitHub', link: 'https://github.com/mooeypoo/funcystr' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' }
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Basic Usage', link: '/examples/' },
            { text: 'Advanced Usage', link: '/examples/advanced' },
            // { text: 'Markdown Processing', link: '/examples/markdown' }
          ]
        }
      ],
      '/demo/': [
        {
          text: 'Try it out!',
          items: [
            { text: 'Interactive Demo', link: '/demo/' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mooeypoo/funcystr' }
    ]
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})
