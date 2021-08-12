---
id: api
title: APIs
---


- [Config parameters](#swiper-parameters)
- [Instance methods](#methods)
- [Life hooks](#life-hooks)
- [Using Plugins](#using-plugins)
- [Plugin List](#plugin-list)

## Swiper parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| direction | string | 'horizontal' | Could be 'horizontal' or 'vertical' (for vertical slider). |
| speed | number | 300 | Duration of transition between slides (in ms) |
| loop | boolean | false | Set to true to enable continuous loop mode. (v2.0.0+) |
| freeMode | boolean | false | Set to true to disable slides fixed position. (v2.0.0+) |
| initialSlide | number | 0 | Index number of initial slide. |
| spaceBetween | number | 0 | Distance between slides in px. |
| longSwipesMs | number | 300 | Minimal duration (in ms) to trigger swipe to next/previous slide during long swipes |
| longSwipesRatio | number | 0.5 | 	Ratio to trigger swipe to next/previous slide during long swipes. |
| slidePrevClass | string | 'swiper-slide-prev' | CSS class name of slide which is right before currently active slide |
| slideNextClass | string | 'swiper-slide-next' | CSS class name of slide which is right after currently active slide |
| slideActiveClass | string | 'swiper-slide-active' | CSS class name of currently active slide |
| slideClass | string | 'swiper-slide' | CSS class name of slide |
| wrapperClass | string | 'swiper-wrapper' | CSS class name of slides' wrapper |
| touchRatio | number | 1 | Touch ratio |
| touchAngle | number | 45 | Allowable angle (in degrees) to trigger touch move. Range of values: `[0, 90]`.|
| touchStartPreventDefault | boolean | true | If disabled, `touchstart` (`mousedown`) event won't be prevented |
| touchStartForcePreventDefault | boolean | false | Force to always prevent default for `touchstart` (`mousedown`) event |
| touchMoveStopPropagation | boolean | false | If enabled, then propagation of "touchmove" will be stopped |
| mousewheel | object/boolean | false | Enables navigation through slides using mouse wheel. Object with mousewheel parameters or boolean true to enable with default settings. |
| passiveListeners | boolean | true | Passive event listeners will be used by default where possible to improve scrolling performance on mobile devices. But if you need to use `e.preventDefault` and you have conflict with it, then you should disable this parameter |
| resistance | boolean | true | Set to false if you want to disable resistant bounds |
| resistanceRatio | number | 0.85 | This option allows you to control resistance ratio |
| plugins | TinySwiperPlugins[] | undefined | Plugins for Tiny-Swiper instance. |
| excludeElements | HTMLElements[] | `[]` | An HTMLElement array which contains all elements that do not trigger swipe. |
| slidesPerView | number | 1 | Number of slides per view (slides visible at the same time on slider's container). |
| centeredSlides | boolean | false | If true, then active slide will be centered, not always on the left side. |

## Methods

| Method | Description |
|---|---|
| update | Update instance status if you changed DOM manually. |
| updateSize | Update instance status if DOM size changed. |
| slideTo (targetIndex: number, duration?: number) | Slide to specific index with specificated time duration. |
| destroy | Destroy slider instance, detach all events listeners and reset style. |
| on(eventName: string, cb: function) | Register life hooks callback function. |
| off(eventName: string, cb: function) | Cancel life hooks callback function. |
| use(TinySwiperPlugin[]) | Register plugins globally. |

## Life Hooks

You can do something at special moments by registering Tiny-Swiper instance life hooks. Such as create a plugin.

| HookName | Parameters | Description |
|---|---|---|
| `before-init` | `instance: SwiperInstance` | Before Tiny-Swiper instance initialize. |
| `after-init` |  `instance: SwiperInstance` | After Tiny-Swiper instance initialize. |
| `before-slide` | `currentIndex: number, state: State, newIndex: number` | Before Tiny-Swiper instance slide changes. `index` does not change yet. |
| `scroll` | `state: State` | Sliders is scrolling. |
| `after-slide` | `newIndex: number, state: State` | After Tiny-Swiper instance slide changes.  |
| `before-destroy` | `instance: SwiperInstance` | Before Tiny-Swiper instance is destroyed. |
| `after-destroy` | `instance: SwiperInstance` | After Tiny-Swiper instance is destroyed, every thing is restored. |

## Using Plugins

Tiny-Swiper instance only reserve core functions such as `init` `destroy` `LifeHooks`. So, You should load specific plugin if you need something special likes pagination.

Plugin is under `lib/modules` folder. You could import theme as ES modules:

```javascript
import { SwiperPluginPagination } from 'tiny-swiper' // Since v1.2.0

// or

import SwiperPluginPagination from 'tiny-swiper/lib/modules/pagination.min.js'
```

Or via CDN:

```html
<script src="https://unpkg.com/tiny-swiper@latest/lib/modules/pagination.min.js"></script>
```

And the most important —— initialization:

1. Register `SwiperPluginPagination` as default plugin, so every Swiper instance will be supported.

    ```javascript
    // All intances instantiated with Swiper has pagination plugin
    Swiper.use([ SwiperPluginPagination ])

    const swiper = new Swiper(
        swiperContainerElement,
        {
            // SwiperPluginPagination configuration,
            // just make sure that pagination is not equal to false.
            pagination: {
                clickable: true
            }
        }
    )
    ```

2.  Or just for current instance via the `plugin` parameter

    ```javascript
    const swiper = new Swiper(
        swiperContainerElement,
        {
            // SwiperPluginPagination configuration.
            pagination: {
                clickable: true
            },

            // Add SwiperPluginPagination plugin.
            plugins: [ SwiperPluginPagination ]
        }
    )
    ```

:::caution
Notice: Two configurations are mutually exclusive. Plugin parameter gets higher priority.
:::

Do not forget, just keep Plugin parameter at the **first level** of configuration.


## Plugin List

- [Pagination](#pagination)
- [Lazyload](#lazyload)
- [Keyboard Control](#keyboard-control)
- [Mousewheel](#mousewheel)
- [Navigation](#navigation)
- [AutoPlay](#autoplay)

### Pagination

Pagination is the indicator of siwper for indicating current `index`.

- Global name on `window`: `SwiperPluginPagination`.
- Configuration name: `pagination`.

#### Usage

```javascript
import SwiperPluginPagination from 'tiny-swiper/lib/modules/pagination.min.js'

const swiper = new Swiper(
    swiperContainerElement,
    {
        // SwiperPluginPagination configuration.
        pagination: {
            clickable: true
        },

        // Add SwiperPluginPagination plugin.
        plugins: [ SwiperPluginPagination ]
    }
)
```

**Notice**: Tiny-Swiper does not provide default CSS file. You have to define style yourself.

#### Pagination Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| pagination | object/boolean | undefined | Object with navigation parameters. |

| Parameter | Type | default | Description |
|---|---|---|---|
| clickable | boolean | false | If true then clicking on pagination button will cause transition to appropriate slide |
| clickableClass | string | 'swiper-pagination-clickable' | CSS class name set to pagination when it is clickable |
| bulletClass | string | 'swiper-pagination-bullet' | CSS class name of single pagination bullet |
| bulletActiveClass | string | 'swiper-pagination-bullet-active' | CSS class name of currently active pagination bullet |
| renderBullet | function(index, className) | null | This parameter allows to totally customize pagination bullets, you need to pass a function that accepts index number of pagination bullet and required element class name (className) |

### Lazyload

Try loading less images to reduce the number of HTTP requests.

- Global name on `window`: `SwiperPluginLazyload`.
- Configuration name: `lazyload`.

#### Usage

Using `data-src` attribute to enable lazyload. `.swiper-lazy-preloader` will keep display till image is loaded/error. Viewing the [demonstration](https://js.org/tiny-swiper/#plugins).

```html
<div class="swiper-container">
    <div class="swiper-wrapper">

        <!-- Lazy image -->
        <div class="swiper-slide">
            <img data-src="path/to/picture-1.jpg" class="swiper-lazy">
            <div class="swiper-lazy-preloader"></div>
        </div>

        <div class="swiper-slide">
            <img data-src="path/to/picture-2.jpg" class="swiper-lazy">
            <div class="swiper-lazy-preloader"></div>
        </div>

        <div class="swiper-slide">
            <img data-src="path/to/picture-3.jpg" class="swiper-lazy">
            <div class="swiper-lazy-preloader"></div>
        </div>
    </div>
</div>
```

```javascript
Swiper.use([ SwiperPluginLazyload ])

var mySwiper = new Swiper('#swiper', {
    lazyload: {
        loadPrevNext: false,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: false,
        elementClass: 'swiper-lazy',
        loadingClass: 'swiper-lazy-loading',
        loadedClass: 'swiper-lazy-loaded',
        preloaderClass: 'swiper-lazy-preloader'
    }
})
```

| Parameter | Type | default | Description |
|---|---|---|---|
| lazyload | object/boolean | undefined | Object with parameters. |

| Parameter | Type | default | Description |
|---|---|---|---|
| loadPrevNext | boolean | false | Set to "true" to enable lazy loading for the closest slides images (for previous and next slide images) |
| loadPrevNextAmount | number | 1 | Amount of next/prev slides to preload lazy images in. Can't be less than slidesPerView |
| loadOnTransitionStart | boolean | false | Loading image on `before-slide` event. loading on `after-slide` if set to `false`. |
| elementClass | string | 'swiper-lazy'	| CSS class name of lazy element |
| loadingClass | string | 'swiper-lazy-loading' | CSS class name of lazy loading element |
| loadedClass |	string | 'swiper-lazy-loaded' | CSS class name of lazy loaded element |
| preloaderClass |	string | 'swiper-lazy-preloader' | CSS class name of lazy preloader |


### Keyboard Control

Control Tiny-Swiper with directional arrow keys on keyboard.

- Global name on `window`: `SwiperPluginKeyboardControl`.
- Configuration name: `keyboard`.

#### Usage

```javascript
Swiper.use([ SwiperPluginKeyboardControl ])

var mySwiper = new Swiper('#swiper', {
    keyboard: {
        enabled: true,
        onlyInViewport: true
    }
})
```

| Parameter | Type | default | Description |
|---|---|---|---|
| keyboard | object/boolean | undefined | Object with parameters. |

| Parameter | Type | default | Description |
|---|---|---|---|
| enabled | boolean | true | Set to "true" to enable keyboard control function. |
| onlyInViewport | boolean | true | Keyboard control will be enabled only if container element is displayed in viewport integrally. |


### Mousewheel

Control Tiny-Swiper with mouse.

- Global name on `window`: `SwiperPluginMousewheel`.
- Configuration name: `mousewheel`.

#### Usage

```javascript
import SwiperPluginMousewheel from 'tiny-swiper/lib/modules/mousewheel.min.js'

const swiper = new Swiper(
    swiperContainerElement,
    {
        // SwiperPluginMousewheel configuration.
        mousewheel: {
            interval: 1000
        },

        // Add SwiperPluginMousewheel plugin.
        plugins: [ SwiperPluginMousewheel ]
    }
)
```

**Notice**: SwiperPluginMousewheel was completely stripped from core module since `v2.x`.

#### Mousewheel Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| mousewheel | object/boolean | undefined | Object with mousewheel parameters. |

| Parameter | Type | default | Description |
|---|---|---|---|
| invert | boolean | false | Invert the direction of scroll wheel on the mouse |
| sensitivity | number | 1 | The threshold value of scroll distance |
| interval | number | 400 | Time to suspend slide between two swip actions |

### Navigation

Control Tiny-Swiper with Navigation Button.

- Global name on `window`: `SwiperPluginNavigation`.
- Configuration name: `navigation`.

#### Usage

```javascript
import SwiperPluginNavigation from 'tiny-swiper/lib/modules/navigation.min.js'

const swiper = new Swiper(
    swiperContainerElement,
    {
        // SwiperPluginNavigation configuration.
        navigation: {
            nextEl: 'className | HTMLElement',
            prevEl: 'className | HTMLElement',
            disabledClass: 'swiper-button-disabled',
        },

        // Add SwiperPluginNavigation plugin.
        plugins: [ SwiperPluginNavigation ]
    }
)
```

#### Navigation Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| navigation | object/boolean | undefined | Object with navigation parameters. |

| Parameter | Type | default | Description |
|---|---|---|---|
| nextEl | string / HTMLElement | null | String with CSS selector or HTML element of the element that will work like "next" button after click on it |
| prevEl | string / HTMLElement | null | String with CSS selector or HTML element of the element that will work like "prev" button after click on it |
| disabledClass | string | 'swiper-button-disabled' | CSS class name added to navigation button when it becomes disabled |



### AutoPlay


- Global name on `window`: `SwiperPluginAutoPlay`.
- Configuration name: `autoplay`.

#### Usage

```javascript
import SwiperPluginAutoPlay from 'tiny-swiper/lib/modules/autoPlay.min.js'

const swiper = new Swiper(
    swiperContainerElement,
    {
        // SwiperPluginAutoPlay configuration.
        autoplay: {
            delay: 1000
        },

        // Add SwiperPluginAutoPlay plugin.
        plugins: [ SwiperPluginAutoPlay ]
    }
)
```

#### AutoPlay Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| autoplay | object/boolean | undefined | Object with AutoPlay parameters. |

| Parameter | Type | default | Description |
|---|---|---|---|
| delay | number | 3000 | Delay between transitions (in ms). |
| disableOnInteraction | boolean | true | Set to false and autoplay will not be disabled after user interactions (touch), it will be restarted every time after interaction |
| reverseDirection | boolean | false | Enables autoplay in reverse direction |
| stopOnLastSlide | boolean | false | Enable this parameter and autoplay will be stopped when it reaches last slide (has no effect in loop mode) |
| waitForTransition | boolean | true | TinySwiper will start auto slide countdown after `after-slide` event, otherwise `before-slide`. |
