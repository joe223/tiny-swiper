<p align="center">
    <a href="https://github.com/joe223/tiny-swiper" target="_blank">
        <img width="120" src="https://user-images.githubusercontent.com/10026019/96370953-3068bd00-1192-11eb-818a-936282fb9616.png">
    </a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img alt="npm" src="https://img.shields.io/npm/v/tiny-swiper"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img src="https://img.badgesize.io/joe223/tiny-swiper/master/lib/index.min.js?compression=gzip"></a>
    <a href="https://travis-ci.com/joe223/tiny-swiper" target="_blank"><img src="https://img.shields.io/travis/com/joe223/tiny-swiper"></a>
    <a href="https://coveralls.io/github/joe223/tiny-swiper?branch=dev" target="_blank"><img src="https://img.shields.io/coveralls/github/joe223/tiny-swiper/master"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img alt="NPM" src="https://img.shields.io/npm/l/tiny-swiper"></a>
    <a href="https://www.npmjs.com/package/tiny-swiper" target="_blank"><img alt="GitHub issues" src="https://img.shields.io/github/issues/joe223/tiny-swiper"></a>
</p>

<h1 align="center">Tiny-Swiper</h1>

Lightweight, extensible and powerful JavaScript carousel with native-like experience for the web.
Zero dependency, written in vanilla JavaScript, used for free and without any attribution.

## Documentation

To check out live examples and docs, visit https://joe223.com/tiny-swiper.

## Guide to usage

Install Swiper via npm or yarn:

```shell
$ npm install tiny-swiper --save
```

If you prefer CDN, just make sure constructor `Swiper` is defined in browser global environment.

```html
<script src="https://unpkg.com/tiny-swiper@latest"></script>
```

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

## FAQ

#### 1. Should I use Tiny-Swiper?

Tiny-Swiper keeps the core functions likes Touch/Resistance/Intermittent control, we usually did not use many features on mobile side after all. That the reason why it is smaller and the purpose I wrote it.

If you are looking for some feature special or going to create a complicate slide project. Please check [APIs](#swiper-parameters) before importing to ensure the feature you want is supported. Full-featured SwiperJS should be a better choice sometimes.


## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions


## License

Tiny-Swiper is licensed under a [MIT License](./LICENSE).
