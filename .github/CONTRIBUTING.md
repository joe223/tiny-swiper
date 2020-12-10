# Contributing Guide to Tiny-Swiper

If you want contribute to Tiny-Swiper, here are something you should familiar with.

## Project Structure

- `packages/tiny-swiper`: Main package of Tiny-Swiper.

    - `lib`: Built implementation files for distribution. Do **NOT** modify it manually.

    - `types`: TypeScript type declaration files for distribution. Generated automatically.

    - `src`: Source code of Tiny-Swiper.

        - `core`: Core module.
        - `modules`: Tiny-Swiper plugins.

    - `__test__`: Unit/E2E test cases.

- `packages/website`: Documentation website

## Development setup

Make sure that you have Node.js version 12+, lerna and yarn.

After forking and clone the repo, run

```shell
lerna bootstrap
```

Check `packages/tiny-swiper` directory and run

```shell
npm run dev
```

if you are going to update something of Tiny-Swiper main package.
