# Vue Telescope Browser Extensions

Browser extensions for [Vue Telescope](https://vuetelescope.com): available on Chrome, Firefox and Edge.

[![Chrome Addon](https://badgen.net/chrome-web-store/v/neaebjphlfplgdhedjdhcnpjkndddbpd?icon=chrome)](https://chrome.google.com/webstore/detail/vue-telescope/neaebjphlfplgdhedjdhcnpjkndddbpd)
[![Firefox Addon](https://badgen.net/amo/v/vue-telescope?icon=firefox)](https://addons.mozilla.org/en-GB/firefox/addon/vue-telescope/)
[![Edge Addon](https://badgen.net/badge/icon/v1.5.8?icon=windows&label=Microsoft+Edge)](https://microsoftedge.microsoft.com/addons/detail/vue-telescope/icgcillpgelpleniodgkmohgdmeogodl)

[![Extension Screenshot](https://user-images.githubusercontent.com/904724/105485378-12d55300-5cad-11eb-82f9-6cdaf214e6fa.jpg)](https://vuetelescope.com)

## Features
- [UnoCSS](https://github.com/unocss/unocss) - The instant on-demand Atomic CSS engine.
- [TypeScript](https://www.typescriptlang.org/) - type safe
- [Components auto importing](./src/components)
- [Icons](./src/components) - Access to icons from any iconset directly
- 🖥 Content Script - Use Vue even in content script
- 🌍 WebExtension - isomorphic extension for Chrome, Firefox, and others
- 📃 Dynamic `manifest.json` with full type support

## Installation

- [Get the Chrome Extension 🍭](https://chrome.google.com/webstore/detail/vue-telescope/neaebjphlfplgdhedjdhcnpjkndddbpd)
- [Get the Firefox Addon 🦊](https://addons.mozilla.org/en-GB/firefox/addon/vue-telescope/)
- [Get the Microsoft Edge Extension 🪟](https://microsoftedge.microsoft.com/addons/detail/vue-telescope/icgcillpgelpleniodgkmohgdmeogodl)

## Manual installation

[download-extension-link]: https://github.com/nuxtlabs/vue-telescope-extensions/tree/main/vue-telescope-extension

### Chrome

1. Enter `chrome://extensions` in the URL bar
2. Enable the developer mode (toggle at the top right)
3. Click on "Load unpacked" button and select the unzipped directory
4. That's it ✨&nbsp;! *We recommend to pin the extension to quickly discover if a website uses Vue.js.*

![vt-chrome-extension](https://user-images.githubusercontent.com/904724/88188033-98614300-cc37-11ea-9500-f0e3ae3d97f0.gif)

### Firefox

1. Enter `about:debugging` in the URL bar
2. Go to "This Firefox" section
3. Click on "Load Temporary Add-on" and select the zip
4. That's it ✨!

![vt-firefox-extension](https://user-images.githubusercontent.com/904724/88186887-1d4b5d00-cc36-11ea-96c9-2b6367920863.gif)

## Development

### Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that are shared in popup and options page.
  - `styles` - styles shared in popup and options page
  - `assets` - assets used in Vue components
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets (mainly for `manifest.json`).
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

### Setup

Make sure to have [Pnpm](https://pnpm.io/) installed.

After cloning the repository, install the dependencies:

```bash
pnpm install
```

#### Chrome:

Launch the project with:

```bash
pnpm dev
```

- To have a preview in Chrome, you have to go to: `chrome://extensions/`, then enable developer mode (toggle at top right), then click on "Load unpacked" button and select the `extension/dist` directory created.

#### Firefox

```bash
pnpm dev-firefox
```

- To have a preview in Firefox, you have to go to: `about:debugging`, then click to "This Firefox" section and select the `extension/dist/manifest.json` directory created.

### Build

To build the extension you have to run:

```bash
pnpm build
```

and then:

```bash
pnpm build-zip
```
You will obtain a `vue-telescope-extension.zip` in the root directory then you can upload to the Chrome and Firefox webstore.

## License

[MIT](./LICENSE)

## Pre-packed

### WebExtension Libraries

- [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) - WebExtension browser API Polyfill with types
- [`webext-bridge`](https://github.com/antfu/webext-bridge) - effortlessly communication between contexts

### Vite Plugins

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - Directly use `browser` and Vue Composition API without importing
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - components auto import
- [`unplugin-icons`](https://github.com/antfu/unplugin-icons) - icons as components
  - [Iconify](https://iconify.design) - use icons from any icon sets [🔍Icônes](https://icones.netlify.app/)

### Vue Plugins

- [VueUse](https://github.com/antfu/vueuse) - collection of useful composition APIs

### UI Frameworks

- [UnoCSS](https://github.com/unocss/unocss) - the instant on-demand Atomic CSS engine

### Coding Style

- Use Composition API with [`<script setup>` SFC syntax](https://github.com/vuejs/rfcs/pull/227)
- [ESLint](https://eslint.org/) with [@antfu/eslint-config](https://github.com/antfu/eslint-config), single quotes, no semi

### Dev tools

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - fast, disk space efficient package manager
- [esno](https://github.com/antfu/esno) - TypeScript / ESNext node runtime powered by esbuild
- [npm-run-all](https://github.com/mysticatea/npm-run-all) - Run multiple npm-scripts in parallel or sequential
- [web-ext](https://github.com/mozilla/web-ext) - Streamlined experience for developing web extensions


## Credits

Based on template [vitesse-webext](https://github.com/antfu/vitesse-webext) made by [antfu](https://github.com/antfu)

[![Volta](https://user-images.githubusercontent.com/904724/195351818-9e826ea9-12a0-4b06-8274-352743cd2047.png)](https://volta.net)
This template is originally made for the [volta.net](https://volta.net) browser extension.

## Variations

This is a variant of [Vitesse](https://github.com/antfu/vitesse), check out the [full variations list](https://github.com/antfu/vitesse#variations).
