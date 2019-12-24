(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Swiper = factory());
}(this, function () { 'use strict';

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
  function removeAttr(el, attr) {
    el.removeAttribute(attr);
  }
  function detectTouch() {
    return Boolean('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 || window.DocumentTouch && document instanceof DocumentTouch);
  }
  /**
   * get Element transform
   * @param {HTMLElement} el
   * @param {Boolean} isHorizontal
   * @returns {Number}
   */

  function getTranslate(el, isHorizontal) {
    var matrix = getComputedStyle(el).transform.replace(/[a-z]|\(|\)|\s/g, '').split(',').map(parseFloat);
    var arr;

    if (matrix.length === 16) {
      arr = matrix.slice(12, 14);
    } else if (matrix.length === 6) {
      arr = matrix.slice(4, 6);
    }

    return arr[isHorizontal ? 0 : 1] || 0;
  }

  var formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO']; // eslint-disable-next-line
  /**
   * Swiper Class
   */

  var Swiper =
  /*#__PURE__*/
  function () {
    function Swiper(el, config) {
      config = Swiper.formatConfig(config);
      el = typeof el === 'string' ? document.body.querySelector(el) : el;
      this.index = 0;
      this.scrolling = false;
      this.config = config;
      this.supportTouch = detectTouch();
      this.$el = el;
      this.$wrapper = el.querySelector("." + config.wrapperClass);
      this.eventHub = {};
      this.initPlugins(config.plugins || Swiper.plugins);
      this.emit('before-init', this);
      this.initListener();
      this.initTouchStatus();
      this.initWheelStatus();
      this.update();
      this.attachListener();
      this.emit('after-init', this);
      this.scroll(config.initialSlide);
    }

    Swiper.use = function use(plugins) {
      Swiper.plugins = plugins;
    };

    Swiper.formatConfig = function formatConfig(config) {
      if (config === void 0) {
        config = {};
      }

      var defaultConfig = {
        direction: 'horizontal',
        touchRatio: 1,
        touchAngle: 45,
        longSwipesRatio: 0.5,
        initialSlide: 0,
        loop: false,
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

      if (config.mousewheel) {
        config.mousewheel = _extends({
          invert: false,
          sensitivity: 1
        }, config.mousewheel);
      }

      return _extends({}, defaultConfig, {}, config);
    };

    var _proto = Swiper.prototype;

    _proto.initPlugins = function initPlugins(plugins) {
      var _this = this;

      (plugins || []).forEach(function (plugin) {
        return plugin(_this);
      });
    };

    _proto.on = function on(evtName, cb) {
      var eventHub = this.eventHub;

      if (!eventHub[evtName]) {
        eventHub[evtName] = [cb];
      } else {
        eventHub[evtName].push(cb);
      }
    };

    _proto.off = function off(evtName, cb) {
      var eventHub = this.eventHub;

      if (eventHub[evtName]) {
        var index = eventHub[evtName].indexOf(cb);
        index > -1 && eventHub[evtName].splice(index, 1);
      }
    };

    _proto.emit = function emit(evtName) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      var eventHub = this.eventHub;

      if (eventHub[evtName]) {
        eventHub[evtName].forEach(function (cb) {
          return cb.apply(void 0, data);
        });
      }
    };

    _proto.initListener = function initListener() {
      var _this2 = this;

      var $wrapper = this.$wrapper,
          config = this.config,
          supportTouch = this.supportTouch;
      this.listeners = {
        onTouchStart: function onTouchStart(e) {
          for (var i = 0; i < config.excludeElements.length; i++) {
            if (config.excludeElements[i].contains(e.target)) return;
          }

          _this2.initTouchStatus();

          var touchStatus = _this2.touchStatus;
          var shouldPreventDefault = config.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1 || config.touchStartForcePreventDefault;
          touchStatus.startOffset = getTranslate($wrapper, _this2.isHorizontal);

          _this2.transform(touchStatus.startOffset);

          $wrapper.style.transition = 'none';
          touchStatus.isTouchStart = true;
          touchStatus.touchStartTime = Date.now();
          touchStatus.touchTracks.push({
            x: supportTouch ? e.touches[0].pageX : e.pageX,
            y: supportTouch ? e.touches[0].pageY : e.pageY
          });
          if (shouldPreventDefault && !config.passiveListeners) e.preventDefault();
        },
        onTouchMove: function onTouchMove(e) {
          var touchStatus = _this2.touchStatus;
          var touchTracks = touchStatus.touchTracks;
          if (!touchStatus.isTouchStart || touchStatus.isScrolling) return;
          if (config.touchMoveStopPropagation) e.stopPropagation();
          var currentPosition = {
            x: supportTouch ? e.touches[0].pageX : e.pageX,
            y: supportTouch ? e.touches[0].pageY : e.pageY
          };
          var diff = {
            x: currentPosition.x - touchTracks[touchTracks.length - 1].x,
            y: currentPosition.y - touchTracks[touchTracks.length - 1].y
          };
          touchTracks.push(currentPosition);
          var touchAngle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180 / Math.PI;
          var offset = 0;

          if (_this2.isHorizontal) {
            if (touchAngle < config.touchAngle || touchStatus.isTouching) {
              touchStatus.isTouching = true;
              offset = diff.x;
              e.preventDefault();
            } else {
              touchStatus.isScrolling = true;
            }
          } else {
            if (90 - touchAngle < config.touchAngle || touchStatus.isTouching) {
              touchStatus.isTouching = true;
              offset = diff.y;
              e.preventDefault();
            } else {
              touchStatus.isScrolling = true;
            }
          }

          _this2.scrollPixel(offset * config.touchRatio);
        },
        onTouchEnd: function onTouchEnd() {
          if (!_this2.touchStatus.isTouchStart) return;
          var index = _this2.index,
              boxSize = _this2.boxSize,
              touchStatus = _this2.touchStatus;
          var swipTime = Date.now() - touchStatus.touchStartTime;
          var transform = getTranslate($wrapper, _this2.isHorizontal);
          var computedOffset = transform - touchStatus.startOffset;
          var jump = Math.ceil(Math.abs(computedOffset) / boxSize);
          var longSwipeIndex = Math.ceil(Math.abs(computedOffset) / boxSize - config.longSwipesRatio);
          $wrapper.style.transition = "transform ease " + config.speed + "ms"; // long swip

          if (swipTime > _this2.config.longSwipesMs) {
            _this2.scroll(_this2.index + longSwipeIndex * (computedOffset > 0 ? -1 : 1), true);
          } else {
            // short swip
            _this2.scroll(computedOffset > 0 ? index - jump : index + jump, true);
          }

          _this2.initTouchStatus();
        },
        onWheel: function onWheel(e) {
          var index = _this2.index,
              wheelStatus = _this2.wheelStatus;
          var deltaY = e.deltaY;

          if ((Math.abs(deltaY) - Math.abs(wheelStatus.wheelDelta) > 0 || !wheelStatus.wheeling) && Math.abs(deltaY) >= config.mousewheel.sensitivity) {
            _this2.scroll(deltaY > 0 ? index - 1 : index + 1);
          }

          wheelStatus.wheelDelta = deltaY;
          clearTimeout(wheelStatus.wheelingTimer);
          wheelStatus.wheeling = true;
          wheelStatus.wheelingTimer = setTimeout(function () {
            _this2.initWheelStatus();
          }, 200);
          e.preventDefault();
          e.stopPropagation();
        }
      };
    };

    _proto.attachListener = function attachListener$1() {
      var $el = this.$el,
          config = this.config,
          supportTouch = this.supportTouch;
      var _this$listeners = this.listeners,
          onTouchStart = _this$listeners.onTouchStart,
          onTouchMove = _this$listeners.onTouchMove,
          onTouchEnd = _this$listeners.onTouchEnd,
          onWheel = _this$listeners.onWheel;

      if (supportTouch) {
        attachListener($el, 'touchstart', onTouchStart, {
          passive: config.passiveListeners,
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

      if (config.mousewheel) {
        attachListener($el, 'wheel', onWheel);
      }
    };

    _proto.detachListener = function detachListener$1() {
      var $el = this.$el;
      var _this$listeners2 = this.listeners,
          onTouchStart = _this$listeners2.onTouchStart,
          onTouchMove = _this$listeners2.onTouchMove,
          onTouchEnd = _this$listeners2.onTouchEnd,
          onWheel = _this$listeners2.onWheel;

      detachListener($el, 'touchstart', onTouchStart);

      detachListener($el, 'touchmove', onTouchMove);

      detachListener($el, 'touchend', onTouchEnd);

      detachListener($el, 'touchcancel', onTouchEnd);

      detachListener($el, 'mousedown', onTouchStart);

      detachListener(document, 'mousemove', onTouchMove);

      detachListener(document, 'mouseup', onTouchEnd);

      detachListener($el, 'wheel', onWheel);
    };

    _proto.transform = function transform(offset) {
      this.$wrapper.style.transform = this.isHorizontal ? "translate3d(" + offset + "px, 0, 0)" : "translate3d(0, " + offset + "px, 0)";
    };

    _proto.scroll = function scroll(index, force) {
      var _this3 = this;

      if (index === void 0) {
        index = 0;
      }

      if (force === void 0) {
        force = false;
      }

      if (this.scrolling && !force) return;
      var config = this.config,
          minIndex = this.minIndex,
          maxIndex = this.maxIndex,
          minTransform = this.minTransform,
          maxTransform = this.maxTransform;
      var offset = index * this.boxSize + this.baseTransform;
      index = index < minIndex ? minIndex : index > maxIndex ? maxIndex : index;
      this.emit('before-slide', this.index, this, index);
      this.scrolling = true;
      this.transform(-(offset > maxTransform ? maxTransform : offset < minTransform ? minTransform : offset));
      var $current = this.$list[index];
      var $prev = this.$list[index - 1];
      var $next = this.$list[index + 1];
      this.$list.forEach(function ($slide, i) {
        removeClass($slide, [config.slidePrevClass, config.slideNextClass, config.slideActiveClass]);

        if (i === index) {
          addClass($current, config.slideActiveClass);
        }

        if (i === index - 1) {
          addClass($prev, config.slidePrevClass);
        }

        if (i === index + 1) {
          addClass($next, config.slideNextClass);
        }
      });
      this.index = index;
      setTimeout(function () {
        _this3.scrolling = false;

        _this3.emit('after-slide', index, _this3);
      }, this.config.speed + this.config.intermittent);
    };

    _proto.scrollPixel = function scrollPixel(px) {
      var ratio = px.toExponential().split('e')[1];
      var expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1;
      var oldTransform = getTranslate(this.$wrapper, this.isHorizontal);

      if (this.config.resistance) {
        if (px > 0 && oldTransform - this.minTransform >= 0) {
          px -= Math.pow(px * expand, this.config.resistanceRatio) / expand;
        } else if (px < 0 && oldTransform + this.maxTransform <= 0) {
          px += Math.pow(-px * expand, this.config.resistanceRatio) / expand;
        } // if ((px > 0 && this.index === 0) || (px < 0 && this.index === this.maxIndex)) {
        //     px = px * Math.pow(this.config.resistanceRatio, 4)
        // }

      }

      this.transform(oldTransform + px);
    };

    _proto.initTouchStatus = function initTouchStatus() {
      this.touchStatus = {
        touchTracks: [],
        startOffset: 0,
        touchStartTime: 0,
        isTouchStart: false,
        isScrolling: false,
        isTouching: false
      };
    };

    _proto.initWheelStatus = function initWheelStatus() {
      this.wheelStatus = {
        wheeling: false,
        wheelDelta: 0,
        wheelingTimer: false
      };
    };

    _proto.update = function update() {
      var _this4 = this;

      var $el = this.$el,
          $wrapper = this.$wrapper,
          index = this.index,
          config = this.config;
      var wrapperStyle = $wrapper.style;
      var isHorizontal = config.direction === 'horizontal';
      $el.style.overflow = 'hidden';
      this.isHorizontal = isHorizontal;
      this.$list = [].slice.call($el.getElementsByClassName(config.slideClass));
      this.minIndex = 0;
      this.maxIndex = this.$list.length - (config.centeredSlides ? 1 : Math.ceil(config.slidesPerView));
      this.viewSize = isHorizontal ? $el.offsetWidth : $el.offsetHeight;
      this.slideSize = (this.viewSize - Math.ceil(config.slidesPerView - 1) * config.spaceBetween) / config.slidesPerView;
      this.boxSize = this.slideSize + config.spaceBetween;
      this.baseTransform = config.centeredSlides ? (this.slideSize - this.viewSize) / 2 : 0;
      this.minTransform = -this.baseTransform;
      this.maxTransform = this.boxSize * this.$list.length - config.spaceBetween - this.viewSize - this.baseTransform;
      this.$list.forEach(function (item) {
        item.style[isHorizontal ? 'width' : 'height'] = _this4.slideSize + "px";
        item.style[isHorizontal ? 'margin-right' : 'margin-bottom'] = config.spaceBetween + "px";
      });
      wrapperStyle.willChange = 'transform';
      wrapperStyle.transition = "transform ease " + config.speed + "ms";
      wrapperStyle[isHorizontal ? 'width' : 'height'] = this.boxSize * this.$list.length + "px";
      wrapperStyle.display = 'flex';
      wrapperStyle.flexDirection = isHorizontal ? 'row' : 'column';
      this.transform(-index * this.boxSize);
    };

    _proto.destroy = function destroy() {
      var $el = this.$el,
          $wrapper = this.$wrapper,
          config = this.config;
      var slideActiveClass = config.slideActiveClass;
      this.emit('before-destroy', this);
      this.$list.forEach(function (item) {
        removeAttr(item, 'style');
        removeClass(item, [slideActiveClass]);
      });
      removeAttr($wrapper, 'style');
      removeAttr($el, 'style');
      this.detachListener();
      this.emit('after-destroy', this);
      this.$el = null;
      this.$list = [];
      this.$wrapper = null;
      this.eventHub = {};
      this.config = Swiper.formatConfig();
    };

    return Swiper;
  }();

  return Swiper;

}));
//# sourceMappingURL=index.js.map
