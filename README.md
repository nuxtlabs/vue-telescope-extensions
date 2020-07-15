# vue-telemetry-website

> Curated list of vuejs websites

## Installation

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

## Build

To build the extension you have to run:

```bash
yarn build
```

and then:

```bash
yarn build-zip
```

You will obtain a `zip` file inside `dist-zip` directory you can upload to the Chrome and Firefox webstore.
