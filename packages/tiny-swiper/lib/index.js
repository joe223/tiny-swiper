(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Swiper = factory());
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

  var defaultOptions = {
    // `isHorizontal` is computed value
    direction: 'horizontal',
    touchRatio: 1,
    touchAngle: 45,
    longSwipesRatio: 0.5,
    initialSlide: 0,
    loop: false,
    freeMode: false,
    mousewheel: false,
    pagination: false,
    passiveListeners: true,
    resistance: true,
    resistanceRatio: 0.85,
    speed: 300,
    longSwipesMs: 300,
    intermittent: 0,
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
    excludeElements: []
  };
  function optionFormatter(userOptions) {
    var options = _extends({}, defaultOptions, {}, userOptions);

    return _extends({}, options, {
      isHorizontal: options.direction === 'horizontal'
    });
  }

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
    var formerTrace = logs[index - 1];
    var diff = {
      x: trace.x - formerTrace.x,
      y: trace.y - formerTrace.y
    };
    var duration = trace.time - formerTrace.time;
    var velocityX = diff.x / duration;
    var velocityY = diff.y / duration;
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
      logs.push(_extends({}, position, {
        time: Date.now()
      }));
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
      transforms: 0
    };
    return state;
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
  function updateStyle(el, style, forceRender) {
    Object.keys(style).forEach(function (prop) {
      // TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'.
      el.style[prop] = style[prop];
    }); // eslint-disable-next-line @typescript-eslint/no-unused-expressions

    forceRender && getComputedStyle(el);
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

  function Sensor(element, env, state, options, operations) {
    var formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO'];
    var preheat = operations.preheat,
        move = operations.move,
        stop = operations.stop;
    var touchable = env.touchable;

    function update(ele) {
      element = ele;
    }

    function getPosition(e) {
      var touch = touchable ? e.changedTouches[0] : e;
      return {
        x: touch.pageX,
        y: touch.pageY
      };
    }

    function onTouchStart(e) {
      var _element = element,
          $wrapper = _element.$wrapper;
      var shouldPreventDefault = options.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1 || options.touchStartForcePreventDefault;
      if (shouldPreventDefault && !options.passiveListeners) e.preventDefault();
      preheat(getPosition(e), getTranslate($wrapper, options.isHorizontal));
    }

    function onTouchMove(e) {
      if (options.touchMoveStopPropagation) e.stopPropagation();
      move(getPosition(e));
      state.isTouching && e.preventDefault();
    }

    function onTouchEnd(e) {
      onTouchMove(e);
      stop();
    }

    function attach() {
      var _element2 = element,
          $el = _element2.$el;

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
      var _element3 = element,
          $el = _element3.$el;
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
      detach: detach,
      update: update
    };
  }

  function Env() {
    return {
      touchable: Boolean('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 || window.DocumentTouch && document instanceof DocumentTouch)
    };
  }

  function getExpand(options, element) {
    return options.slidesPerView >= element.$list.length ? options.slidesPerView - element.$list.length + 1 : 1;
  }

  function Limitation(element, measure, options) {
    var $list = element.$list;
    var viewSize = measure.viewSize,
        slideSize = measure.slideSize,
        boxSize = measure.boxSize;
    var expand = getExpand(options, element);
    var base = -expand * boxSize + (options.centeredSlides ? (slideSize - viewSize) / 2 : 0); // [min, max] usually equal to [-x, 0]

    var max = base;
    var min = options.spaceBetween + viewSize + base - boxSize * $list.length;
    var minIndex = 0;
    var maxIndex = $list.length - (options.centeredSlides || options.loop ? 1 : Math.ceil(options.slidesPerView));
    var limitation = {
      max: max,
      min: min,
      base: base,
      minIndex: minIndex,
      maxIndex: maxIndex
    };
    return limitation;
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

  function Renderer(element, options, eventHub) {
    function render(instance, duration, cb) {
      var _element = element,
          $list = _element.$list,
          $wrapper = _element.$wrapper;
      var index = instance.index;
      var wrapperStyle = {
        transition: instance.isStart ? 'none' : "transform ease " + (duration === undefined ? options.speed : duration) + "ms",
        transform: options.isHorizontal ? "translate3d(" + instance.transforms + "px, 0, 0)" : "translate3d(0, " + instance.transforms + "px, 0)"
      };
      var $current = $list[index];
      var $prev = $list[index - 1];
      var $next = $list[index + 1];
      updateStyle($wrapper, wrapperStyle);

      if (!instance.isStart) {
        $list.forEach(function ($slide, i) {
          removeClass($slide, [options.slidePrevClass, options.slideNextClass, options.slideActiveClass]);

          if (i === index) {
            addClass($current, options.slideActiveClass);
          }

          if (i === index - 1) {
            addClass($prev, options.slidePrevClass);
          }

          if (i === index + 1) {
            addClass($next, options.slideNextClass);
          }
        });
      }
    }

    function init() {
      var _itemStyle;

      var _element2 = element,
          $list = _element2.$list,
          $wrapper = _element2.$wrapper;
      var wrapperStyle = {
        display: 'flex',
        willChange: 'transform',
        flexDirection: options.isHorizontal ? 'row' : 'column'
      };
      var itemStyle = (_itemStyle = {}, _itemStyle[options.isHorizontal ? 'margin-right' : 'margin-bottom'] = options.spaceBetween + "px", _itemStyle);
      updateStyle($wrapper, wrapperStyle);
      $list.forEach(function ($slide) {
        return updateStyle($slide, itemStyle);
      });

      if (options.loop) {
        var expand = getExpand(options, element);
        var leftExpandList = $list.slice(-expand).map(function ($slide) {
          return $slide.cloneNode(true);
        });
        var rightExpandList = $list.slice(0, expand).map(function ($slide) {
          return $slide.cloneNode(true);
        });
        leftExpandList.forEach(function ($shadowSlide, index) {
          $wrapper.appendChild(rightExpandList[index]);
          $wrapper.insertBefore(leftExpandList[index], $list[0]);
        });
      }
    }

    function destroy() {
      var _element3 = element,
          $list = _element3.$list,
          $wrapper = _element3.$wrapper;
      var arr = ['display', 'will-change', 'flex-direction'];
      var itemProp = options.isHorizontal ? 'margin-right' : 'margin-bottom';
      arr.forEach(function (propertyName) {
        $wrapper.style.removeProperty(propertyName);
      });
      $list.forEach(function ($slide) {
        return $slide.style.removeProperty(itemProp);
      });
    }

    function update(ele) {
      element = ele;
      init();
    }

    return {
      init: init,
      render: render,
      update: update,
      destroy: destroy
    };
  }

  function Operations(state, options, measure, limitation, renderer, eventHub) {
    function update(limit, mes) {
      limitation = limit;
      measure = mes;
    }

    function render(duration) {
      renderer.render(state, duration);
    }

    function transform(trans) {
      state.transforms = trans;
    }

    function slideTo(targetIndex, duration) {
      var computedIndex;

      if (options.loop) {
        computedIndex = targetIndex < limitation.minIndex ? limitation.maxIndex - (limitation.minIndex - targetIndex) + 1 : targetIndex > limitation.maxIndex ? limitation.minIndex + (targetIndex - limitation.maxIndex) - 1 : targetIndex;
        var offset = -targetIndex * measure.boxSize + limitation.base;
        console.log(computedIndex, targetIndex, offset);
        transform(offset); // TODO
      } else {
        computedIndex = targetIndex < limitation.minIndex ? limitation.minIndex : targetIndex > limitation.maxIndex ? limitation.maxIndex : targetIndex;

        var _offset = -computedIndex * measure.boxSize + limitation.base;

        transform(_offset > limitation.max ? limitation.max : _offset < limitation.min ? limitation.min : _offset);
      }

      state.index = computedIndex;
      eventHub.emit('before-slide', targetIndex, state);
      render(duration);
    }

    function scrollPixel(px) {
      var transforms = state.transforms;
      var ratio = Number(px.toExponential().split('e')[1]);
      var expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1;
      var oldTransform = transforms; // For optimizing, do not calculate `px` if options.loop === true

      if (options.resistance && !options.loop) {
        if (px > 0 && oldTransform >= limitation.max) {
          px -= Math.pow(px * expand, options.resistanceRatio) / expand;
        } else if (px < 0 && oldTransform <= limitation.min) {
          px += Math.pow(-px * expand, options.resistanceRatio) / expand;
        }
      }

      state.transforms += px;
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
      state.transforms = originTransform;
    }

    function preheat(originPosition, originTransform) {
      var tracker = state.tracker;
      tracker.push(originPosition);
      initLayout(originTransform);
      initStatus(originTransform);
      state.isStart = true;
      render();
    }

    function move(position) {
      var tracker = state.tracker;
      if (!state.isStart || state.isScrolling) return;
      tracker.push(position);
      var vector = tracker.vector();
      var offset = 0;

      if (options.isHorizontal) {
        if (vector.angle < options.touchAngle || state.isTouching) {
          state.isTouching = true;
          offset = vector.x * options.touchRatio;
        } else {
          state.isScrolling = true;
        }
      } else {
        if (90 - vector.angle < options.touchAngle || state.isTouching) {
          state.isTouching = true;
          offset = vector.y * options.touchRatio;
        } else {
          state.isScrolling = true;
        }
      }

      scrollPixel(offset);
      render();
    }

    function stop() {
      var index = state.index,
          tracker = state.tracker;
      var duration = tracker.getDuration();
      var trans = state.transforms - state.startTransform;
      var jump = Math.ceil(Math.abs(trans) / measure.boxSize);
      var longSwipeIndex = Math.ceil(Math.abs(trans) / measure.boxSize - options.longSwipesRatio);
      state.isStart = false;
      console.log(index, state.transforms, state.startTransform, longSwipeIndex); // long siwpe

      if (duration > options.longSwipesMs) {
        slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1));
      } else {
        // short swipe
        slideTo(trans > 0 ? index - jump : index + jump);
      }

      tracker.clear();
      initStatus();
    }

    return {
      update: update,
      render: render,
      transform: transform,
      slideTo: slideTo,
      scrollPixel: scrollPixel,
      initStatus: initStatus,
      initLayout: initLayout,
      preheat: preheat,
      move: move,
      stop: stop
    };
  }

  var Swiper = function Swiper(el, userOptions) {
    var options = optionFormatter(userOptions);
    var eventHub = EventHub();
    var env = Env();
    var element = Element(el, options);
    var measure = Measure(options, element);
    var limitation = Limitation(element, measure, options);
    var renderer = Renderer(element, options);
    var state = State();
    var operations = Operations(state, options, measure, limitation, renderer, eventHub);
    var sensor = Sensor(element, env, state, options, operations);

    function destroy() {
      sensor.detach();
      renderer.destroy();
      eventHub.clear();
    }

    function update() {
      var ele = Element(el, options);
      var meas = Measure(options, element);
      var limit = Limitation(element, measure, options);
      sensor.detach();
      operations.update(limit, meas);
      renderer.update(ele);
      renderer.init();
    }

    function on(evtName, cb) {
      eventHub.on(evtName, cb);
    }

    function off(evtName, cb) {
      eventHub.off(evtName, cb);
    }

    function slideTo(index, duration) {
      operations.slideTo(index, duration);
    }

    var instance = {
      state: state,
      on: on,
      off: off,
      update: update,
      destroy: destroy,
      slideTo: slideTo,
      options: options
    };

    function load() {
      (options.plugins || Swiper.plugins || []).forEach(function (plugin) {
        return plugin(instance, options);
      });
      renderer.init();
      sensor.attach();
      operations.slideTo(options.initialSlide || 0, 0);
    }

    load();
    return instance;
  };

  Swiper.use = function (plugins) {
    Swiper.plugins = plugins;
  };

  return Swiper;

})));
//# sourceMappingURL=index.js.map
