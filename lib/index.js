(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Swiper = factory());
}(this, function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function addClassName(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return !el.classList.contains(clz) && el.classList.add(clz);
    });
  }
  function removeClassName(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return el.classList.contains(clz) && el.classList.remove(clz);
    });
  }
  function detectTouch() {
    return Boolean('ontouchstart' in window || window.navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0 || window.DocumentTouch && document instanceof DocumentTouch);
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

  var formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO'];
  /**
   * Swiper Class
   */

  var Swiper =
  /*#__PURE__*/
  function () {
    function Swiper(el, config) {
      config = Swiper.formatConfig(config || {});
      this.index = 0;
      this.scrolling = false;
      this.config = config;
      this.supportTouch = detectTouch();

      if (typeof el === 'string') {
        el = document.body.querySelector(el);
      }

      this.$el = el;
      this.$wrapper = el.querySelector("." + config.wrapperClass);
      this.initListener();
      this.initTouchStatus();
      this.initWheelStatus();
      this.update();
      this.attachListener();
      this.initPagination();
      this.scroll(config.initialSlide);
    }

    var _proto = Swiper.prototype;

    _proto.initListener = function initListener() {
      var _this = this;

      var $wrapper = this.$wrapper,
          config = this.config,
          supportTouch = this.supportTouch;
      this.listeners = {
        handleTouchStart: function handleTouchStart(e) {
          if (_this.$pagination && _this.$pagination.contains(e.target)) return;

          _this.initTouchStatus();

          var touchStatus = _this.touchStatus;
          var shouldPreventDefault = config.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1 || config.touchStartForcePreventDefault;
          touchStatus.startOffset = getTranslate($wrapper, _this.isHorizontal);

          _this.transform(touchStatus.startOffset);

          $wrapper.style.transition = 'none';
          touchStatus.isTouchStart = true;
          touchStatus.touchStartTime = Date.now();
          touchStatus.touchTracks.push({
            x: supportTouch ? e.touches[0].pageX : e.pageX,
            y: supportTouch ? e.touches[0].pageY : e.pageY
          });
          if (shouldPreventDefault && !config.passiveListeners) e.preventDefault();
        },
        handleTouchMove: function handleTouchMove(e) {
          var touchStatus = _this.touchStatus;
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

          if (_this.isHorizontal) {
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

          _this.scrollPixel(offset * config.touchRatio);
        },
        handleTouchEnd: function handleTouchEnd(e) {
          if (!_this.touchStatus.isTouchStart) return;
          var index = _this.index,
              slideSize = _this.slideSize,
              touchStatus = _this.touchStatus;
          var swipTime = Date.now() - touchStatus.touchStartTime;
          var computedOffset = getTranslate($wrapper, _this.isHorizontal) - touchStatus.startOffset;
          $wrapper.style.transition = "transform ease " + config.speed + "ms"; // long swip

          if (swipTime > _this.config.longSwipesMs) {
            if (Math.abs(computedOffset) >= slideSize * config.longSwipesRatio) {
              _this.scroll(computedOffset > 0 ? index - 1 : index + 1, true);
            } else {
              _this.scroll(index, true);
            }
          } else {
            // short swip
            if (computedOffset === 0) {
              _this.scroll(index, true);
            } else {
              _this.scroll(computedOffset > 0 ? index - 1 : index + 1, true);
            }
          }

          _this.initTouchStatus();
        },
        handleWheel: function handleWheel(e) {
          var index = _this.index,
              wheelStatus = _this.wheelStatus;
          var deltaY = e.deltaY;

          if ((Math.abs(deltaY) - Math.abs(wheelStatus.wheelDelta) > 0 || !wheelStatus.wheeling) && Math.abs(deltaY) >= config.mousewheel.sensitivity) {
            _this.scroll(deltaY > 0 ? index - 1 : index + 1);
          }

          wheelStatus.wheelDelta = deltaY;
          clearTimeout(wheelStatus.wheelingTimer);
          wheelStatus.wheeling = true;
          wheelStatus.wheelingTimer = setTimeout(function () {
            _this.initWheelStatus();
          }, 200);
          e.preventDefault();
          e.stopPropagation();
        }
      };
    };

    _proto.attachListener = function attachListener() {
      var $el = this.$el,
          config = this.config,
          supportTouch = this.supportTouch;
      var _this$listeners = this.listeners,
          handleTouchStart = _this$listeners.handleTouchStart,
          handleTouchMove = _this$listeners.handleTouchMove,
          handleTouchEnd = _this$listeners.handleTouchEnd,
          handleWheel = _this$listeners.handleWheel;

      if (supportTouch) {
        $el.addEventListener('touchstart', handleTouchStart, {
          passive: config.passiveListeners,
          capture: false
        }, false);
        $el.addEventListener('touchmove', handleTouchMove);
        $el.addEventListener('touchend', handleTouchEnd);
        $el.addEventListener('touchcancel', handleTouchEnd);
      } else {
        $el.addEventListener('mousedown', handleTouchStart);
        document.addEventListener('mousemove', handleTouchMove);
        document.addEventListener('mouseup', handleTouchEnd);
      }

      if (config.mousewheel) {
        $el.addEventListener('wheel', handleWheel);
      }
    };

    _proto.detachListener = function detachListener() {
      var $el = this.$el;
      var _this$listeners2 = this.listeners,
          handleTouchStart = _this$listeners2.handleTouchStart,
          handleTouchMove = _this$listeners2.handleTouchMove,
          handleTouchEnd = _this$listeners2.handleTouchEnd,
          handleWheel = _this$listeners2.handleWheel;
      $el.removeEventListener('touchstart', handleTouchStart);
      $el.removeEventListener('touchmove', handleTouchMove);
      $el.removeEventListener('touchend', handleTouchEnd);
      $el.removeEventListener('touchcancel', handleTouchEnd);
      $el.removeEventListener('mousedown', handleTouchStart);
      document.removeEventListener('mousemove', handleTouchMove);
      document.removeEventListener('mouseup', handleTouchEnd);
      $el.removeEventListener('wheel', handleWheel);
    };

    Swiper.formatConfig = function formatConfig(config) {
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
        slidePrevClass: 'swiper-slide-prev',
        slideNextClass: 'swiper-slide-next',
        slideActiveClass: 'swiper-slide-active',
        slideClass: 'swiper-slide',
        wrapperClass: 'swiper-wrapper',
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchMoveStopPropagation: false
      };

      if (config.pagination) {
        config.pagination = _extends({
          clickable: false,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }, config.pagination);
      }

      if (config.mousewheel) {
        config.mousewheel = _extends({
          invert: false,
          sensitivity: 1
        }, config.mousewheel);
      }

      return _extends({}, defaultConfig, {}, config);
    };

    _proto.transform = function transform(offset) {
      this.$wrapper.style.transform = this.isHorizontal ? "translate3d(" + offset + "px, 0, 0)" : "translate3d(0, " + offset + "px, 0)";
    };

    _proto.scroll = function scroll(index, force) {
      var _this2 = this;

      if (index === void 0) {
        index = 0;
      }

      if (force === void 0) {
        force = false;
      }

      if (this.scrolling && !force) return;
      var config = this.config,
          minIndex = this.minIndex,
          maxIndex = this.maxIndex;
      index = index < minIndex ? minIndex : index > maxIndex ? maxIndex : index;
      var offset = index * this.boxSize;
      this.scrolling = true;
      this.transform(-offset);
      var $current = this.$list[index];
      var $prev = this.$list[index - 1];
      var $next = this.$list[index + 1];

      if ($current) {
        addClassName($current, config.slideActiveClass);
        removeClassName($current, [config.slidePrevClass, config.slideNextClass]);
      }

      if ($prev) {
        addClassName($prev, config.slidePrevClass);
        removeClassName($prev, [config.slideActiveClass, config.slideNextClass]);
      }

      if ($next) {
        addClassName($next, config.slideNextClass);
        removeClassName($next, [config.slideActiveClass, config.slidePrevClass]);
      }

      this.index = index;
      this.updatePagination();
      setTimeout(function () {
        _this2.scrolling = false;
      }, this.config.speed + this.config.intermittent);
    };

    _proto.scrollPixel = function scrollPixel(px) {
      if (this.config.resistance) {
        // if (px > 0 && this.index === 0) {
        //     px = px ** this.config.resistanceRatio
        // } else if (px < 0 && this.index === this.maxIndex) {
        //     px = -1 * (Math.abs(px) ** this.config.resistanceRatio)
        // }
        if (px > 0 && this.index === 0 || px < 0 && this.index === this.maxIndex) {
          px = px * Math.pow(this.config.resistanceRatio, 2);
        }
      }

      var oldTransform = getTranslate(this.$wrapper, this.isHorizontal);
      this.transform(oldTransform + px);
    };

    _proto.initPagination = function initPagination() {
      var _this3 = this;

      var config = this.config;
      if (!config.pagination) return;
      var _config$pagination = config.pagination,
          bulletClass = _config$pagination.bulletClass,
          bulletActiveClass = _config$pagination.bulletActiveClass;
      var $pagination = typeof config.pagination.el === 'string' ? document.body.querySelector(config.pagination.el) : config.pagination.el;
      var $pageList = [];
      var $group = document.createDocumentFragment();
      this.$pagination = $pagination;
      this.$pageList = $pageList;
      this.$list.forEach(function (item, index) {
        var $page = document.createElement('div');
        addClassName($page, index === _this3.index ? [bulletClass, bulletActiveClass] : bulletClass);
        $pageList.push($page);
        $group.appendChild($page);
      });
      $pagination.appendChild($group);

      if (config.pagination.clickable) {
        $pagination.addEventListener('click', function (e) {
          _this3.scroll($pageList.indexOf(e.target));

          e.stopPropagation();
        });
      }
    };

    _proto.destroyPagination = function destroyPagination() {
      var config = this.config;
      if (!config.pagination) return;
      this.$pagination.innerHTML = '';
      this.$pageList = [];
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

    _proto.updatePagination = function updatePagination() {
      var _this4 = this;

      var bulletActiveClass = this.config.pagination.bulletActiveClass;
      this.$pageList && this.$pageList.forEach(function ($page, index) {
        if (index === _this4.index) {
          addClassName($page, bulletActiveClass);
        } else {
          removeClassName($page, bulletActiveClass);
        }
      });
    };

    _proto.update = function update() {
      var _this5 = this;

      var $el = this.$el,
          $wrapper = this.$wrapper,
          index = this.index,
          config = this.config,
          isHorizontal = this.isHorizontal;
      var wrapperStyle = $wrapper.style;
      this.$list = [].slice.call($el.getElementsByClassName(config.slideClass));
      this.slideSize = isHorizontal ? $el.offsetWidth : $el.offsetHeight;
      this.$list.forEach(function (item) {
        item.style[isHorizontal ? 'width' : 'height'] = _this5.slideSize + "px";
        item.style[isHorizontal ? 'margin-right' : 'margin-bottom'] = config.spaceBetween + "px";
      });
      $el.style.overflow = 'hidden';
      wrapperStyle.willChange = 'transform';
      wrapperStyle.transition = "transform ease " + this.config.speed + "ms";
      wrapperStyle[isHorizontal ? 'width' : 'height'] = this.boxSize * this.$list.length + "px";
      wrapperStyle.display = 'flex';
      wrapperStyle.flexDirection = this.isHorizontal ? 'row' : 'column';
      this.transform(-index * this.boxSize);
    };

    _proto.destroy = function destroy() {
      var $el = this.$el,
          $wrapper = this.$wrapper,
          config = this.config;
      var slideActiveClass = config.slideActiveClass;
      this.$list.forEach(function (item) {
        item.removeAttribute('style');
        removeClassName(item, [slideActiveClass]);
      });
      this.$list = [];
      $wrapper.removeAttribute('style');
      $el.removeAttribute('style');
      this.detachListener();
      this.destroyPagination();
    };

    _createClass(Swiper, [{
      key: "isHorizontal",
      get: function get() {
        return this.config.direction === 'horizontal';
      }
    }, {
      key: "maxIndex",
      get: function get() {
        return this.$list.length - 1;
      }
    }, {
      key: "minIndex",
      get: function get() {
        return 0;
      }
    }, {
      key: "boxSize",
      get: function get() {
        return this.slideSize + this.config.spaceBetween;
      }
    }]);

    return Swiper;
  }(); // Try to keep it less than 400 lines.

  return Swiper;

}));
