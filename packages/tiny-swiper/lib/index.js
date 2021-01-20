(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Swiper = factory());
}(this, (function () { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function addClass(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return !el.classList.contains(clz) && el.classList.add(clz);
    });
  }
  function removeClass(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return el.classList.contains(clz) && el.classList.remove(clz);
    });
  }
  function attachListener(el, evtName, handler, opts) {
    el.addEventListener(evtName, handler, opts);
  }
  function detachListener(el, evtName, handler) {
    el.removeEventListener(evtName, handler);
  }
  function setAttr(el, attr, value) {
    if (value === void 0) {
      value = '';
    }

    el.setAttribute(attr, value);
    return el;
  }
  function setStyle(el, style, forceRender) {
    Object.keys(style).forEach(function (prop) {
      // TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'.
      el.style[prop] = style[prop];
    }); // eslint-disable-next-line @typescript-eslint/no-unused-expressions

    forceRender && getComputedStyle(el);
    return el;
  }
  function getTranslate(el, isHorizontal) {
    var matrix = getComputedStyle(el).transform.replace(/[a-z]|\(|\)|\s/g, '').split(',').map(parseFloat);
    var arr = [];

    if (matrix.length === 16) {
      arr = matrix.slice(12, 14);
    } else if (matrix.length === 6) {
      arr = matrix.slice(4, 6);
    }

    return arr[isHorizontal ? 0 : 1] || 0;
  }

  function translate(state, env, options, duration) {
    var $wrapper = env.element.$wrapper;
    var wrapperStyle = {
      transition: state.isStart ? 'none' : "transform ease " + duration + "ms",
      transform: options.isHorizontal ? "translate3d(" + state.transforms + "px, 0, 0)" : "translate3d(0, " + state.transforms + "px, 0)"
    };
    setStyle($wrapper, wrapperStyle);
  }

  var defaultOptions = {
    // `isHorizontal` is computed value
    direction: 'horizontal',
    touchRatio: 1,
    touchAngle: 45,
    longSwipesRatio: 0.5,
    initialSlide: 0,
    loop: false,
    freeMode: false,
    passiveListeners: true,
    resistance: true,
    resistanceRatio: 0.85,
    speed: 300,
    longSwipesMs: 300,
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: false,
    slidePrevClass: 'swiper-slide-prev',
    slideNextClass: 'swiper-slide-next',
    slideActiveClass: 'swiper-slide-active',
    slideClass: 'swiper-slide',
    wrapperClass: 'swiper-wrapper',
    touchStartPreventDefault: true,
    touchStartForcePreventDefault: false,
    touchMoveStopPropagation: false,
    excludeElements: [],
    injections: {
      translate: translate
    }
  };
  function optionFormatter(userOptions) {
    var options = _extends({}, defaultOptions, userOptions);

    return _extends({}, options, {
      isHorizontal: options.direction === 'horizontal'
    });
  }

  var LIFE_CYCLES = {
    BEFORE_INIT: 'before-init',
    AFTER_INIT: 'after-init',
    BEFORE_SLIDE: 'before-slide',
    SCROLL: 'scroll',
    AFTER_SLIDE: 'after-slide',
    BEFORE_DESTROY: 'before-destroy',
    AFTER_DESTROY: 'after-destroy'
  };
  function EventHub() {
    var hub = {};

    function on(evtName, cb) {
      if (!hub[evtName]) {
        hub[evtName] = [cb];
      } else {
        hub[evtName].push(cb);
      }
    }

    function off(evtName, cb) {
      if (hub[evtName]) {
        var index = hub[evtName].indexOf(cb); // eslint-disable-next-line @typescript-eslint/no-unused-expressions

        index > -1 && hub[evtName].splice(index, 1);
      }
    }

    function emit(evtName) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      if (hub[evtName]) {
        hub[evtName].forEach(function (cb) {
          return cb.apply(void 0, data);
        });
      }
    }

    function clear() {
      hub = {};
    }

    return {
      on: on,
      off: off,
      emit: emit,
      clear: clear
    };
  }

  var delta = 180 / Math.PI;
  function Vector(logs, index) {
    var trace = logs[index];
    var formerTrace = logs[index - 1] || trace; // In case click action, there will be only one log data

    var diff = {
      x: trace.x - formerTrace.x,
      y: trace.y - formerTrace.y
    };
    var duration = trace.time - formerTrace.time;
    var velocityX = diff.x / duration || 0;
    var velocityY = diff.y / duration || 0;
    var angle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * delta;
    return _extends({}, diff, {
      angle: angle,
      velocityX: velocityX,
      velocityY: velocityY
    });
  }
  function Tracker() {
    var logs = [];

    function push(position) {
      logs.push(_extends({
        time: Date.now()
      }, position));
    }

    function vector() {
      return Vector(logs, logs.length - 1);
    }

    function clear() {
      logs = [];
    }

    function getLogs() {
      return logs;
    }

    function getDuration() {
      var first = logs[0];
      var last = logs[logs.length - 1];
      return first ? last.time - first.time : 0;
    }

    function getOffset() {
      var first = logs[0];
      var last = logs[logs.length - 1];
      return first ? {
        x: last.x - first.x,
        y: last.y - first.y
      } : {
        x: 0,
        y: 0
      };
    }

    return {
      getDuration: getDuration,
      getOffset: getOffset,
      getLogs: getLogs,
      vector: vector,
      clear: clear,
      push: push
    };
  }

  function State() {
    var state = {
      tracker: Tracker(),
      index: 0,
      startTransform: 0,
      isStart: false,
      isScrolling: false,
      isTouching: false,
      transforms: 0,
      progress: 0
    };
    return state;
  }

  function now() {
    return performance ? performance.now() : Date.now();
  }

  function Tick() {
    var nextFrame = requestAnimationFrame || webkitRequestAnimationFrame || setTimeout;
    var cancelNextFrame = cancelAnimationFrame || webkitCancelAnimationFrame || clearTimeout;
    var startTime;
    var id;

    function run(cb) {
      // eslint-disable-next-line no-void
      startTime = startTime === void 0 ? now() : startTime; // Why do not use callback argument:
      // https://stackoverflow.com/questions/50895206/exact-time-of-display-requestanimationframe-usage-and-timeline

      id = nextFrame(function () {
        var timeStamp = now();
        var interval = timeStamp - startTime;
        startTime = timeStamp;
        cb(interval);
      });
    }

    function stop() {
      startTime = undefined;
      cancelNextFrame(id);
    }

    return {
      run: run,
      stop: stop
    };
  }

  function Animation() {
    var tick = Tick();

    function run(task) {
      tick.run(function (interval) {
        run(task);
        task(interval);
      });
    }

    function stop() {
      tick.stop();
    }

    return {
      run: run,
      stop: stop
    };
  }

  function resetState(state, operations) {
    var tracker = state.tracker;
    var initStatus = operations.initStatus;
    tracker.clear();
    initStatus();
  }

  function Actions(options, env, state, operations) {
    var initLayout = operations.initLayout,
        initStatus = operations.initStatus,
        render = operations.render,
        scrollPixel = operations.scrollPixel,
        slideTo = operations.slideTo,
        getOffsetSteps = operations.getOffsetSteps;
    var animation = Animation();

    function preheat(originPosition, originTransform) {
      var tracker = state.tracker;
      animation.stop();
      tracker.clear();
      tracker.push(originPosition);
      initLayout(originTransform);
      initStatus(originTransform);
      state.isStart = true;
      render();
    }

    function move(position) {
      var tracker = state.tracker;
      var touchRatio = options.touchRatio,
          touchAngle = options.touchAngle,
          isHorizontal = options.isHorizontal;
      if (!state.isStart || state.isScrolling) return;
      tracker.push(position);
      var vector = tracker.vector();
      var displacement = tracker.getOffset(); // Ignore this move action if there is no displacement of screen touch point.
      // In case of minimal mouse move event. (Moving mouse extreme slowly will get the zero offset.)

      if (!displacement.x && !displacement.y) return;

      if (isHorizontal && vector.angle < touchAngle || !isHorizontal && 90 - vector.angle < touchAngle || state.isTouching) {
        var offset = vector[isHorizontal ? 'x' : 'y'] * touchRatio;
        state.isTouching = true;
        scrollPixel(offset);
        render();
      } else {
        state.isScrolling = true;
        tracker.clear();
      }
    }

    function stop() {
      var index = state.index,
          tracker = state.tracker;
      var measure = env.measure;
      if (!state.isStart) return;
      state.isStart = false;

      if (!options.freeMode) {
        var duration = tracker.getDuration();
        var trans = tracker.getOffset()[options.isHorizontal ? 'x' : 'y'];
        var jump = Math.ceil(Math.abs(trans) / measure.boxSize);
        var longSwipeIndex = getOffsetSteps(trans);

        if (duration > options.longSwipesMs) {
          // long swipe action
          slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1));
        } else {
          // short swipe action
          slideTo(trans > 0 ? index - jump : index + jump);
        }

        resetState(state, operations);
      } else {
        var vector = tracker.vector();
        var velocity = vector[options.isHorizontal ? 'velocityX' : 'velocityY'];
        animation.run(function (duration) {
          var offset = velocity * duration;
          velocity *= 0.98;

          if (Math.abs(offset) < 0.01) {
            animation.stop();
            resetState(state, operations);
          } else {
            scrollPixel(offset);
            render(0);
          }
        });
      }
    }

    return {
      preheat: preheat,
      move: move,
      stop: stop
    };
  }

  function Sensor(env, state, options, operations) {
    var touchable = env.touchable;
    var formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO'];
    var actions = Actions(options, env, state, operations);
    var preheat = actions.preheat,
        move = actions.move,
        stop = actions.stop;

    function getPosition(e) {
      var touch = touchable ? e.changedTouches[0] : e;
      return {
        x: touch.pageX,
        y: touch.pageY
      };
    }

    function onTouchStart(e) {
      for (var i = 0; i < options.excludeElements.length; i++) {
        if (options.excludeElements[i].contains(e.target)) return;
      }

      var $wrapper = env.element.$wrapper;
      var shouldPreventDefault = options.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1 || options.touchStartForcePreventDefault; // `preventDefault` can not be called with `passiveListeners`
      //      See: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
      //      And: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md

      if (!touchable && shouldPreventDefault) e.preventDefault();
      preheat(getPosition(e), getTranslate($wrapper, options.isHorizontal));
    }

    function onTouchMove(e) {
      if (options.touchMoveStopPropagation) e.stopPropagation();
      move(getPosition(e));
      if (state.isTouching && e.cancelable !== false) e.preventDefault();
    }

    function onTouchEnd() {
      stop();
    }

    function attach() {
      var $el = env.element.$el;

      if (touchable) {
        attachListener($el, 'touchstart', onTouchStart, {
          passive: options.passiveListeners,
          capture: false
        });
        attachListener($el, 'touchmove', onTouchMove);
        attachListener($el, 'touchend', onTouchEnd);
        attachListener($el, 'touchcancel', onTouchEnd);
      } else {
        attachListener($el, 'mousedown', onTouchStart);
        attachListener(document, 'mousemove', onTouchMove);
        attachListener(document, 'mouseup', onTouchEnd);
      }
    }

    function detach() {
      var $el = env.element.$el;
      detachListener($el, 'touchstart', onTouchStart);
      detachListener($el, 'touchmove', onTouchMove);
      detachListener($el, 'touchend', onTouchEnd);
      detachListener($el, 'touchcancel', onTouchEnd);
      detachListener($el, 'mousedown', onTouchStart);
      detachListener(document, 'mousemove', onTouchMove);
      detachListener(document, 'mouseup', onTouchEnd);
    }

    return {
      attach: attach,
      detach: detach
    };
  }

  function Measure(options, element) {
    var $el = element.$el;
    var viewSize = options.isHorizontal ? $el.offsetWidth : $el.offsetHeight;
    var slideSize = (viewSize - Math.ceil(options.slidesPerView - 1) * options.spaceBetween) / options.slidesPerView;
    var boxSize = slideSize + options.spaceBetween;
    return {
      boxSize: boxSize,
      viewSize: viewSize,
      slideSize: slideSize
    };
  }

  function getExpand(options) {
    if (options.loop) {
      // return options.slidesPerView >= element.$list.length
      //     ? options.slidesPerView - element.$list.length + 1
      //     : 1
      return Math.ceil(options.slidesPerView);
    }

    return 0;
  }
  function Limitation(element, measure, options) {
    var $list = element.$list;
    var viewSize = measure.viewSize,
        slideSize = measure.slideSize,
        boxSize = measure.boxSize;
    var expand = getExpand(options);
    var buffer = expand * boxSize;
    var base = -buffer + (options.centeredSlides ? (viewSize - slideSize) / 2 : 0); // [min, max] usually equal to [-x, 0]

    var max = base;
    var min = options.spaceBetween + (options.loop ? slideSize : viewSize) + base - boxSize * $list.length;
    var minIndex = 0;
    var maxIndex = $list.length - (options.centeredSlides || options.loop ? 1 : Math.ceil(options.slidesPerView));
    var limitation = {
      max: max,
      min: min,
      base: base,
      expand: expand,
      buffer: buffer,
      minIndex: minIndex,
      maxIndex: maxIndex
    };
    return limitation;
  }

  function Env(elem, options) {
    var env = {};

    function update(element) {
      var measure = Measure(options, element);
      var limitation = Limitation(element, measure, options);
      var touchable = Boolean('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 || window.DocumentTouch && document instanceof DocumentTouch);
      Object.assign(env, {
        touchable: touchable,
        element: element,
        measure: measure,
        limitation: limitation
      });
    }

    env.update = update;
    update(elem);
    return env;
  }

  var shallowTag = 'data-shallow-slider';
  var sliderTag = 'data-slider';
  function Renderer(env, options) {
    function updateItem(state) {
      var $wrapper = env.element.$wrapper;
      var index = state.index;
      $wrapper.querySelectorAll("[" + sliderTag + "]").forEach(function ($slide) {
        // eslint-disable-next-line no-bitwise
        var tagNumber = ~~$slide.getAttribute(sliderTag);
        removeClass($slide, [options.slidePrevClass, options.slideNextClass, options.slideActiveClass]);

        if (tagNumber === index) {
          addClass($slide, options.slideActiveClass);
        }

        if (tagNumber === index - 1) {
          addClass($slide, options.slidePrevClass);
        }

        if (tagNumber === index + 1) {
          addClass($slide, options.slideNextClass);
        }
      });
    }

    function render(state, duration, cb, force) {
      var $wrapper = env.element.$wrapper;
      var timing = duration === undefined ? options.speed : duration;
      options.injections.translate(state, env, options, timing); // Update slide style only if scroll action is end.

      if (!state.isStart) updateItem(state);
      force && getComputedStyle($wrapper).transform;
      cb && setTimeout(cb, timing);
    }

    function appendExpandList() {
      if (!options.loop) return;
      var element = env.element,
          limitation = env.limitation;
      var $list = element.$list,
          $wrapper = element.$wrapper;
      var expand = limitation.expand;
      var $leftExpandList = $list.slice(-expand).map(function ($slide) {
        return $slide.cloneNode(true);
      });
      var $rightExpandList = $list.slice(0, expand).map(function ($slide) {
        return $slide.cloneNode(true);
      });
      $leftExpandList.forEach(function ($shadowSlide, index) {
        $wrapper.appendChild(setAttr($rightExpandList[index], shallowTag));
        $wrapper.insertBefore(setAttr($leftExpandList[index], shallowTag), $list[0]);
      });
    }

    function destroyExpandList() {
      env.element.$wrapper.querySelectorAll("[" + shallowTag + "]").forEach(function (item) {
        return env.element.$wrapper.removeChild(item);
      });
    }

    function updateDom() {
      env.element.$list.forEach(function (el, index) {
        return setAttr(el, sliderTag, index);
      });
      destroyExpandList();
      appendExpandList();
    }

    function updateSize() {
      var _itemStyle;

      var element = env.element,
          measure = env.measure;
      var $wrapper = element.$wrapper;
      var wrapperStyle = {
        display: 'flex',
        willChange: 'transform',
        flexDirection: options.isHorizontal ? 'row' : 'column'
      };
      var itemStyle = (_itemStyle = {}, _itemStyle[options.isHorizontal ? 'width' : 'height'] = measure.slideSize + "px", _itemStyle[options.isHorizontal ? 'margin-right' : 'margin-bottom'] = options.spaceBetween + "px", _itemStyle);
      setStyle($wrapper, wrapperStyle);
      $wrapper.querySelectorAll("[" + sliderTag + "]").forEach(function ($slide) {
        return setStyle($slide, itemStyle);
      });
    }

    function init() {
      updateDom();
      updateSize();
    }

    function destroy() {
      var _env$element = env.element,
          $list = _env$element.$list,
          $wrapper = _env$element.$wrapper;
      var arr = ['display', 'will-change', 'flex-direction'];
      var itemProp = options.isHorizontal ? 'margin-right' : 'margin-bottom';
      arr.forEach(function (propertyName) {
        $wrapper.style.removeProperty(propertyName);
      });
      $list.forEach(function ($slide) {
        return $slide.style.removeProperty(itemProp);
      });
      destroyExpandList();
    }

    return {
      init: init,
      render: render,
      destroy: destroy,
      updateSize: updateSize
    };
  }

  /**
   * Detect whether slides is rush out boundary.
   * @param velocity - Velocity larger than zero means that slides move to the right direction
   * @param transform
   * @param limitation
   */

  function isExceedingLimits(velocity, transform, limitation) {
    return velocity > 0 && transform > limitation.max || velocity < 0 && transform < limitation.min;
  }
  /**
   * Return the shortest way to target Index.
   *      Negative number indicate the left direction, Index's value is decreasing.
   *      Positive number means index should increase.
   * @param currentIndex
   * @param targetIndex
   * @param limitation
   * @param defaultWay
   */

  function getShortestWay(currentIndex, targetIndex, limitation, defaultWay) {
    var maxIndex = limitation.maxIndex,
        minIndex = limitation.minIndex; // Source expression show below:
    // const shortcut = defaultWay > 0
    //     ? minIndex - currentIndex + (targetIndex - maxIndex) - 1
    //     : maxIndex - currentIndex + (targetIndex - minIndex) + 1

    var shortcut = (defaultWay > 0 ? 1 : -1) * (minIndex - maxIndex - 1) + targetIndex - currentIndex;
    return Math.abs(defaultWay) > Math.abs(shortcut) ? shortcut : defaultWay;
  }
  /**
   * Get transform exceed value
   * Return zero if is not reached border.
   *
   * @param transform
   * @param limitation
   */

  function getExcess(transform, limitation) {
    var exceedLeft = transform - limitation.max;
    var exceedRight = transform - limitation.min;
    return exceedLeft > 0 ? exceedLeft : exceedRight < 0 ? exceedRight : 0;
  }
  /**
   * The Set of state operations.
   * Every external Render/Sensor/DomHandler are called by this Internal state machine.
   * That gives us the possibility to run Tiny-Swiper in different platform.
   *
   * @param env
   * @param state
   * @param options
   * @param renderer
   * @param eventHub
   * @constructor
   */

  function Operations(env, state, options, renderer, eventHub) {
    /**
     * Calculate the steps amount (boxSize) of offset.
     *  eg: offset = 100, boxSize: 50, steps may equal to 2.
     * @param offset
     */
    function getOffsetSteps(offset) {
      var measure = env.measure;
      return Math.ceil(Math.abs(offset) / measure.boxSize - options.longSwipesRatio);
    }
    /**
     * Call renderer's render function with default params.
     * @param duration
     * @param cb
     * @param force
     */


    function render(duration, cb, force) {
      renderer.render(state, duration, cb, force);
    }
    /**
     * Update Swiper transform attr.
     * @param trans
     */


    function transform(trans) {
      var _env$limitation = env.limitation,
          min = _env$limitation.min,
          max = _env$limitation.max;
      var transRange = max - min + (options.loop ? env.measure.boxSize : 0);
      var len = transRange + 1;
      var progress;
      state.transforms = trans;

      if (options.loop) {
        progress = (max - trans) % len / transRange;
        state.progress = progress < 0 ? 1 + progress : progress > 1 ? progress - 1 : progress;
      } else {
        progress = (max - trans) / transRange;
        state.progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;
      }

      eventHub.emit(LIFE_CYCLES.SCROLL, _extends({}, state));
    }
    /**
     * Update Swiper transform state with certain Index.
     * @param targetIndex
     * @param duration
     */


    function slideTo(targetIndex, duration) {
      var measure = env.measure,
          limitation = env.limitation;
      var len = limitation.maxIndex - limitation.minIndex + 1;
      var computedIndex = options.loop ? (targetIndex % len + len) % len : targetIndex > limitation.maxIndex ? limitation.maxIndex : targetIndex < limitation.minIndex ? limitation.minIndex : targetIndex;
      var newTransform = -computedIndex * measure.boxSize + limitation.base; // Slide to wrapper's boundary while touch end.
      //  Math.abs(excess) ≥ 0
      // Old condition: state.index === computedIndex

      if (getOffsetSteps(newTransform - state.transforms) !== 0 && options.loop) {
        var excess = getExcess(state.transforms, limitation);
        var defaultWay = computedIndex - state.index;
        var shortcut = getShortestWay(state.index, computedIndex, limitation, defaultWay);

        if (shortcut !== defaultWay && !excess) {
          transform(shortcut < 0 ? limitation.min - measure.boxSize : limitation.max + measure.boxSize);
        } else if (state.index === computedIndex) {
          transform(excess > 0 ? limitation.min - measure.boxSize + excess : limitation.max + measure.boxSize + excess);
        } // Set initial offset for rebounding animation.


        render(0, undefined, true);
      }

      eventHub.emit(LIFE_CYCLES.BEFORE_SLIDE, state.index, state, computedIndex);
      state.index = computedIndex;
      transform(newTransform);
      render(duration, function () {
        eventHub.emit(LIFE_CYCLES.AFTER_SLIDE, computedIndex, state);
      });
    }
    /**
     * Scroll pixel by pixel while user dragging.
     * @param px
     */


    function scrollPixel(px) {
      var transforms = state.transforms;
      var measure = env.measure,
          limitation = env.limitation;
      var ratio = Number(px.toExponential().split('e')[1]);
      var expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1;
      var newTransform = transforms; // For optimizing, do not calculate `px` if options.loop === true

      if (options.resistance && !options.loop) {
        if (px > 0 && transforms >= limitation.max) {
          px -= Math.pow(px * expand, options.resistanceRatio) / expand;
        } else if (px < 0 && transforms <= limitation.min) {
          px += Math.pow(-px * expand, options.resistanceRatio) / expand;
        }
      }

      newTransform += px;

      if (options.loop) {
        var vector = state.tracker.vector();
        var velocity = options.isHorizontal ? vector.velocityX : vector.velocityY;
        var excess = getExcess(transforms, limitation);

        if (excess && isExceedingLimits(velocity, transforms, limitation)) {
          newTransform = excess > 0 ? limitation.min - measure.boxSize + excess : limitation.max + measure.boxSize + excess;
        }
      }

      transform(newTransform);
    }

    function initStatus(startTransform) {
      if (startTransform === void 0) {
        startTransform = 0;
      }

      state.startTransform = startTransform;
      state.isStart = false;
      state.isScrolling = false;
      state.isTouching = false;
    }

    function initLayout(originTransform) {
      transform(originTransform);
    }

    function update() {
      slideTo(state.index, 0);
      renderer.updateSize();
    }

    return {
      update: update,
      render: render,
      transform: transform,
      slideTo: slideTo,
      scrollPixel: scrollPixel,
      initStatus: initStatus,
      initLayout: initLayout,
      getOffsetSteps: getOffsetSteps
    };
  }

  function Element(el, options) {
    var $el = typeof el === 'string' ? document.body.querySelector(el) : el;
    var $wrapper = $el.querySelector("." + options.wrapperClass);
    var $list = [].slice.call($el.getElementsByClassName(options.slideClass));
    return {
      $el: $el,
      $wrapper: $wrapper,
      $list: $list
    };
  }

  var Swiper = function Swiper(el, userOptions) {
    var options = optionFormatter(userOptions);
    var eventHub = EventHub();
    var element = Element(el, options);
    var env = Env(element, options);
    var state = State();
    var on = eventHub.on,
        off = eventHub.off,
        emit = eventHub.emit;
    var instance = {
      on: on,
      off: off,
      env: env,
      state: state,
      options: options
    };
    (options.plugins || Swiper.plugins || []).forEach(function (plugin) {
      return plugin(instance, options);
    });
    emit(LIFE_CYCLES.BEFORE_INIT, instance); // Initialize internal module

    var renderer = Renderer(env, options);
    var operations = Operations(env, state, options, renderer, eventHub);
    var sensor = Sensor(env, state, options, operations);

    function destroy() {
      emit(LIFE_CYCLES.BEFORE_DESTROY, instance);
      sensor.detach();
      renderer.destroy();
      emit(LIFE_CYCLES.AFTER_DESTROY, instance);
      eventHub.clear();
    }

    function updateSize() {
      env.update(Element(el, options));
      operations.update();
    }

    function update() {
      renderer.destroy();
      env.update(Element(el, options));
      renderer.init();
      operations.update();
    }

    var slideTo = operations.slideTo;
    Object.assign(instance, {
      update: update,
      destroy: destroy,
      slideTo: slideTo,
      updateSize: updateSize
    });
    renderer.init();
    sensor.attach();
    slideTo(options.initialSlide, 0);
    emit(LIFE_CYCLES.AFTER_INIT, instance);
    return instance;
  };

  Swiper.use = function (plugins) {
    Swiper.plugins = plugins;
  };

  return Swiper;

})));
//# sourceMappingURL=index.js.map
