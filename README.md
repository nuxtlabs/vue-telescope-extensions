# Vue Telemetry Browser Extensions

> Browser extensions for [Vue Telemetry](https://vuetelemetry.com): available on Chrome and Firefox.

![Extension Screenshot](https://user-images.githubusercontent.com/904724/88175523-419f3d80-cc26-11ea-9c44-3c6782c5fbd5.png)


## Installation

- 🟡 &nbsp; Get the Chrome Extension (*pending approval*) see [manual installation](#chrome)

- 🟡 &nbsp; Get the Firefox Addon (*pending approval*), see [manual installation](#firefox)


## Manual installation

### Chrome

// TODO

### Firefox

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
