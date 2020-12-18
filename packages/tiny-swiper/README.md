<p align="center">
    <a href="https://github.com/joe223/tiny-swiper" target="_blank">
        <img width="110" src="https://user-images.githubusercontent.com/10026019/96370953-3068bd00-1192-11eb-818a-936282fb9616.png">
    </a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/tiny-swiper"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img src="https://img.badgesize.io/joe223/tiny-swiper/dev/packages/tiny-swiper/lib/index.min.js?compression=gzip"></a>
    <a href="https://travis-ci.com/joe223/tiny-swiper" target="_blank"><img src="https://img.shields.io/travis/com/joe223/tiny-swiper"></a>
    <a href="https://coveralls.io/github/joe223/tiny-swiper?branch=dev" target="_blank"><img src="https://img.shields.io/coveralls/github/joe223/tiny-swiper/master"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img alt="NPM" src="https://img.shields.io/npm/l/tiny-swiper"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img alt="GitHub issues" src="https://img.shields.io/github/issues/joe223/tiny-swiper"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img src="https://img.shields.io/npm/dt/tiny-swiper.svg"></a>
</p>

<h2 align="center">Tiny-Swiper</h2>

<p align="center">
Ingenious JavaScript Carousel powered by wonderful plugins with native-like experience. 
Lightweight yet extensible. Import plugins as needed, No more, no less.
Zero dependency, written in TypeScript, used for free and without any attribution.
</p>

<p align="center">
Looking for more details about <a href="https://tiny-swiper.joe223.com/docs" target="_blank">APIs</a> and <a href="https://tiny-swiper.joe223.com/docs/demo" target="_blank">Demos</a>, visit <a href="https://tiny-swiper.joe223.com" target="_blank">tiny-swiper.joe223.com</a>
</p>

## Usage

### Installation

```shell
# via npm
$ npm install tiny-swiper --save

# via yarn
$ yarn add tiny-swiper
```

If you prefer CDN

```html
<script src="https://unpkg.com/tiny-swiper@latest"></script>
```

### Initialization

Html code:

```html
<!-- Slider main container -->
<div class="swiper-container">
    <!-- Additional required wrapper -->
    <div class="swiper-wrapper">
        <!-- Slides -->
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        ...
    </div>
    <!-- If we need pagination -->
    <div class="swiper-pagination"></div>
</div>
```

JavaScript/TypeScript code:

```javascript
import Swiper, {
    SwiperPluginLazyload,
    SwiperPluginPagination
} from 'tiny-swiper'

Swiper.use([ SwiperPluginLazyload, SwiperPluginPagination ])

const swiper = new Swiper(swiperContainer: HTMLElement | string, parameters?: TinySwiperParameters)
```

- `new Swiper()` - initialize swiper with options.
- `Swiper.use()` - Register plugin.
- `swiperContainer` - HTMLElement or string (with CSS Selector) of swiper container HTML element. Required.
- `parameters` - object with Swiper parameters. Optional.


You also can load full-featured Tiny-Swiper:

```javascript
import Swiper from 'tiny-swiper/lib/index.full.js'
```

```html
<script src="https://unpkg.com/tiny-swiper@latest/lib/index.full.js"></script>
```

## Browsers support

All modern browsers are supported, include IE10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## Contribution

Please make sure to read the [Contributing Guide](.github/CONTRIBUTING.md) before making a pull request.

Thanks goes to these wonderful people

<a href="https://github.com/joe223/tiny-swiper/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=joe223/tiny-swiper" />
</a>

## License

Tiny-Swiper is licensed under a [MIT License](./LICENSE).
