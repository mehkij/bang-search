# !Bang Search

A Chrome extension that enables a better way to search, inspired by DuckDuckGo's "Bangs".

## Installation

> [!IMPORTANT]
> You must have NPM installed, along with its requirements. Visit the [NPM docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for details on how to set it up.

To run locally, clone this repo and build the distributable folder in the project directory:

```bash
npm run build
```

To install the extension in Chrome, follow these steps:

1. Navigate to `chrome://extensions` in the search bar.
2. Turn on Developer Mode by clicking on the switch in the top right.
3. Click on `Load Unpacked` in the top left, and navigate to the project directory.
4. Select the `dist` folder, and you're good to go!

## Usage

To use the extension, you must first add a URL and Keyword pair. Open the extension, and click on the gear in the top right of the popup. This will bring you to the settings page, where you can add keywords and URL pairs.

> [!WARNING]
> In order to set a keyword, it **must** be prepended with a bang (!). For example: !example. !ex, !e, etc.

To activate the extension, click on Chrome's search bar, and type `!`. Pressing tab afterwards will activate the extension. To use it, type a keyword that you've set, and then begin typing your search query. For example: `!example cats and dogs`

> [!WARNING]
> Entering a search without a keyword or a bang that has not been set will result in the search defaulting to a Google search. Be sure to double-check your set keywords and make sure you prepend it with a bang!
