import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PostalDataPI',
  tagline: 'Global postal code API for 240+ countries and territories with sub-5ms response times',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.postaldatapi.com',
  baseUrl: '/',

  organizationName: 'PostalDataPI',
  projectName: 'postaldatapi-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'PostalDataPI',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api-reference/lookup',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/sdks/python',
          label: 'SDKs',
          position: 'left',
        },
        {
          href: 'https://postaldatapi.com',
          label: 'Dashboard',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quick Start', to: '/getting-started/quickstart' },
            { label: 'API Reference', to: '/api-reference/lookup' },
          ],
        },
        {
          title: 'SDKs',
          items: [
            { label: 'Python', to: '/sdks/python' },
            { label: 'Node.js', to: '/sdks/node' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'PostalDataPI', href: 'https://postaldatapi.com' },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} PostalDataPI. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
