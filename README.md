# Vue Telescope Browser Extensions

> Browser extensions for [Vue Telescope](https://vuetelescope.com): available on Chrome and Firefox.

[![Chrome Addon](https://badgen.net/chrome-web-store/v/neaebjphlfplgdhedjdhcnpjkndddbpd?icon=chrome)](https://chrome.google.com/webstore/detail/vue-telescope/neaebjphlfplgdhedjdhcnpjkndddbpd)
[![Firefox Addon](https://badgen.net/amo/v/vue-telescope?icon=firefox)](https://addons.mozilla.org/en-GB/firefox/addon/vue-telescope/)
[![Edge Addon](https://badgen.net/badge/icon/v1.5.8?icon=windows&label=Microsoft+Edge)](https://microsoftedge.microsoft.com/addons/detail/vue-telescope/icgcillpgelpleniodgkmohgdmeogodl)

[![Extension Screenshot](https://user-images.githubusercontent.com/904724/105485378-12d55300-5cad-11eb-82f9-6cdaf214e6fa.jpg)](https://vuetelescope.com)

## Installation

- [Get the Chrome Extension 🍭](https://chrome.google.com/webstore/detail/vue-telescope/neaebjphlfplgdhedjdhcnpjkndddbpd)
- [Get the Firefox Addon 🦊](https://addons.mozilla.org/en-GB/firefox/addon/vue-telescope/)
- [Get the Microsoft Edge Extension 🪟](https://microsoftedge.microsoft.com/addons/detail/vue-telescope/icgcillpgelpleniodgkmohgdmeogodl)

## Manual installation

[download-extension-link]: https://github.com/nuxt-company/vue-telescope-extensions/releases/download/v1.5.8/vue-telescope-extension-v1.5.8.zip

### Chrome

1. [Download the extension (.zip)][download-extension-link]
2. Unzip it
3. Enter `chrome://extensions` in the URL bar
4. Enable the developer mode (toggle at the top right)
5. Click on "Load unpacked" button and select the unzipped directory
6. That's it ✨&nbsp;! *We recommend to pin the extension to quickly discover if a website uses Vue.js.*

![vt-chrome-extension](https://user-images.githubusercontent.com/904724/88188033-98614300-cc37-11ea-9500-f0e3ae3d97f0.gif)

### Firefox

1. [Download the extension (.zip)][download-extension-link]
2. Enter `about:debugging` in the URL bar
3. Go to "This Firefox" section
3. Click on "Load Temporary Add-on" and select the zip
4. That's it ✨!

![vt-firefox-extension](https://user-images.githubusercontent.com/904724/88186887-1d4b5d00-cc36-11ea-96c9-2b6367920863.gif)

## Development

### Setup

Make sure to have [Yarn](https://classic.yarnpkg.com/en/) installed.

After cloning the repository, install the dependencies:

```bash
yarn install
```

Launch the project with:

```bash
yarn dev
```

To have a preview in Chrome, you have to go to: `chrome://extensions/`, then enable developer mode (toggle at top right), then click on "Load unpacked" button and select the `dist` directory created.

The extension will be automatically reloaded each time you make a change thanks to HMR.

### Build

To build the extension you have to run:

```bash
yarn build
```

and then:

```bash
yarn build-zip
```

You will obtain a `zip` file inside `dist-zip` directory you can upload to the Chrome and Firefox webstore.

## License

[MIT](./LICENSE)
