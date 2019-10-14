# Tiny-Swiper

<p>
	<a href="https://www.npmjs.com/package/tiny-swiper">
		<img src="https://badge.fury.io/js/tiny-swiper.svg"/>
	</a>
	<a href="https://travis-ci.com/joe223/tiny-swiper">
		<img src="https://travis-ci.com/joe223/tiny-swiper.svg?branch=master"/>
	</a>
</p>

2kb gzipped library alternate to Swiper with same API.

## Getting start

- [Getting Started Guide](#guide-to-usage)
- [API](#swiper-parameters)
- [Demos](./demo)

### Guide to usage

Install Swiper via npm or yarn:

```shell
npm install tiny-swiper
yarn add tiny-swiper
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

`new Swiper(swiperContainer: HTMLElement | string, parameters: object)` - initialize swiper with options.

`swiperContainer` HTMLElement or string (with CSS Selector) of swiper container HTML element. Required.
`parameters` object with Swiper parameters. Optional.

For example:

```javascript
var mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100
})
```

### Swiper parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| direction | string | 'horizontal' | Could be 'horizontal' or 'vertical' (for vertical slider). |
| speed | number | 300 | Duration of transition between slides (in ms) |
| initialSlide | number | 0 | Index number of initial slide. |
| spaceBetween | number | 100 | Distance between slides in px. |
| longSwipesRatio | number | 0.5 | 	Ratio to trigger swipe to next/previous slide during long swipes. |
| slidePrevClass | string | 'swiper-slide-prev' | CSS class name of slide which is right before currently active slide |
| slideNextClass | string | 'swiper-slide-next' | CSS class name of slide which is right after currently active slide |
| slideActiveClass | string | 'swiper-slide-active' | CSS class name of currently active slide |
| slideClass | string | 'swiper-slide' | CSS class name of slide |
| wrapperClass | string | 'swiper-wrapper' | CSS class name of slides' wrapper |
| touchStartPreventDefault | boolean | true | If disabled, `touchstart` (`mousedown`) event won't be prevented |
| touchStartPreventDefault | boolean | false | Force to always prevent default for `touchstart` (`mousedown`) event |
| mousewheel | object/boolean | false | Enables navigation through slides using mouse wheel. Object with mousewheel parameters or boolean true to enable with default settings. |
| pagination | object/boolean | false | Object with navigation parameters. |

#### Mousewheel Control Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| sensitivity | number | 1 | Multiplier of mousewheel data, allows to tweak mouse wheel sensitivity |
| invert | boolean | false | Set to true to invert sliding direction |

#### Pagination Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| bulletClass | string | 'swiper-pagination-bullet' | CSS class name of single pagination bullet |
| bulletActiveClass | string | 'swiper-pagination-bullet-active' | CSS class name of currently active pagination bullet |

## License
Tiny-Swiper is licensed under a MIT License.
