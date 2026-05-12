import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Aether Docs",
  description: "Extensive documentation for the Aether Local AI Ecosystem",
  themeConfig: {
    logo: '/images/hero.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Ecosystem Site', link: 'https://earnerbaymalay.github.io' },
      { text: 'GitHub', link: 'https://github.com/earnerbaymalay/aether-tauri' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/getting-started' },
          { text: 'Competitive Analysis', link: '/competitive-analysis' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Daily Usage', link: '/usage' },
          { text: 'Advanced Features', link: '/advanced-features' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Architecture', link: '/architecture' },
          { text: 'Troubleshooting', link: '/troubleshooting' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/earnerbaymalay/aether-tauri' }
    ],
    search: {
      provider: 'local'
    }
  }
})
