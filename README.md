# Vue Telemetry Browser Extensions

> Browser extensions for [Vue Telemetry](https://vuetelemetry.com): available on Chrome and Firefox.

![Extension Screenshot](https://user-images.githubusercontent.com/904724/88175523-419f3d80-cc26-11ea-9c44-3c6782c5fbd5.png)


## Installation

- 🟡 &nbsp; Get the Chrome Extension (*pending approval*) see [manual installation](#chrome)

- 🟡 &nbsp; Get the Firefox Addon (*pending approval*), see [manual installation](#firefox)


## Manual installation

[download-extension-link]: https://github.com/nuxt-company/vue-telemetry-extensions/releases/download/v1.0.0/vue-telemetry-extension-v1.0.0.zip

### Chrome

1. [Download the extension (.zip)][download-extension-link]
2. Unzip it
3. Go to [chrome://extensions/](chrome://extensions/)
4. Enable developer mode toggle (top right)
5. Click on "Load unpacked" and select the unzipped directory
6. That's it ✨! We recommend to pin the extension to quickly discover if a website uses Vue.js.

### Firefox

1. [Download the extension (.zip)][download-extension-link]
2. Unzip it
3. Go to [about:addons](about:addons)

// TODO

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

To have a preview in Chrome, you have to go to: [chrome://extensions/](chrome://extensions/), then enable Developer mode toggle.

You can then load an unpacked extension by selecting the `dist` directory created.

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
