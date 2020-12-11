---
id: api 
title: APIs
---


- [Config parameters](#swiper-parameters)

## Swiper parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| direction | string | 'horizontal' | Could be 'horizontal' or 'vertical' (for vertical slider). |
| speed | number | 300 | Duration of transition between slides (in ms) |
| intermittent | number | 0 | Time to suspend between two swip actions. Only for mousewheel mode. |
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
| pagination | object/boolean | false | Object with navigation parameters. |
| passiveListeners | boolean | true | Passive event listeners will be used by default where possible to improve scrolling performance on mobile devices. But if you need to use `e.preventDefault` and you have conflict with it, then you should disable this parameter |
| resistance | boolean | true | Set to false if you want to disable resistant bounds |
| resistanceRatio | number | 0.85 | This option allows you to control resistance ratio |

### Mousewheel Control Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| sensitivity | number | 1 | Multiplier of mousewheel data, allows to tweak mouse wheel sensitivity |
| invert | boolean | false | Set to true to invert sliding direction |

### Pagination Parameters

| Parameter | Type | default | Description |
|---|---|---|---|
| clickable | boolean | false | If true then clicking on pagination button will cause transition to appropriate slide |
| bulletClass | string | 'swiper-pagination-bullet' | CSS class name of single pagination bullet |
| bulletActiveClass | string | 'swiper-pagination-bullet-active' | CSS class name of currently active pagination bullet |
