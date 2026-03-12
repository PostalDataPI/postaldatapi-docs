import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'index',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quickstart',
        'getting-started/authentication',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/lookup',
        'api-reference/validate',
        'api-reference/city-search',
        'api-reference/metazip',
        'api-reference/about',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/country-codes',
        'guides/error-handling',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'SDKs',
      items: [
        'sdks/python',
        'sdks/node',
      ],
      collapsed: false,
    },
  ],
};

export default sidebars;
