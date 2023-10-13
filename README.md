# Unplugin I18n Merger

Introduction: This code is designed to streamline the management of language semantics and facilitate language switching within a repository of `.i18n` files. It achieves this by merging the content of language files such as language/en.json and language/en.json and storing the merged output. When you modify a value in a language file, those changes are automatically reflected. Likewise, if you remove a key from the `.i18n` file, it will be automatically deleted from all language outputs. Similarly, if you add a new key, it will be consistently added to all language files. The primary goal is to simplify the process of handling language variations and maintain consistency in language semantics.

## Features

- Support for multiple language files.
- Support Template Directory.
- Unplugin Support - Vite, Rollup, Webpack, Nuxt, Esbuild.
- ESM Support.


## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/productdevbook/static/sponsors.svg">
    <img alt="sponsors" src='https://cdn.jsdelivr.net/gh/productdevbook/static/sponsors.svg'/>
  </a>
</p>


## Install

```bash
pnpm i -D unplugin-i18n-merger
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import I18nMerger from 'unplugin-i18n-merger/vite'

export default defineConfig({
  plugins: [
    I18nMerger({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import I18nMerger from 'unplugin-i18n-merger/rollup'

export default {
  plugins: [
    I18nMerger({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-i18n-merger/webpack')({ /* options */ }),
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    ['unplugin-i18n-merger/nuxt', { /* options */ }],
  ],

  i18nMerger: {
    /* options */
  },
})
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-i18n-merger/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import I18nMerger from 'unplugin-i18n-merger/esbuild'

build({
  plugins: [I18nMerger()],
})
```

<br></details>


## Options

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `exportDir` | `string` | `language` | The directory where the merged language files are stored. |
| `templateDir` | `string` | `.i18n` | The directory where the language files are stored. |
| `languages` | `string[]` | `['en', 'tr']` | The languages to be merged. |
| `sortObjectKeys` | `boolean` | `true` | Whether to sort the keys of the merged object. |


## Development

## Usage

1. To use this template, click the "Use this template" button above.
2. Clone the repository to your local machine.
3. Run `pnpm install` to install the dependencies.
4. Run `pnpm build` to build the bundle.
5. Run `pnpm start` to start the bundle.
6. Run `pnpm lint` to lint the code. (You can also run `pnpm lint:fix` to fix the linting errors.)
7. Run `pnpm test` to run the tests. (You can also run `pnpm test:watch` to run the tests in watch mode.)
8. Run `pnpm release` to bump the version. Terminal will ask you to select the version type. And then it will automatically commit and push the changes. GitHub Actions will automatically publish git tags. NPM local registry will automatically publish the package.

## License

MIT License © 2023-PRESENT [productdevbook](https://github.com/productdevbook)