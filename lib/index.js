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
      this.$el.style.overflow = 'hidden';
      this.$wrapper = el.getElementsByClassName(config.wrapperClass)[0];
      this.$list = [].slice.call(el.getElementsByClassName(config.slideClass));
      this.formEls = ['INPUT', 'SELECT', 'OPTION', 'TEXTAREA', 'BUTTON', 'VIDEO'];
      this.initStatus();
      this.update();
      this.initPagination();
      this.scroll(this.config.initialSlide);
      this.initWheel();
    }

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

    var _proto = Swiper.prototype;

    _proto.getTransform = function getTransform(offset) {
      return this.isHorizontal ? "translate3d(" + offset + "px, 0, 0)" : "translate3d(0, " + offset + "px, 0)";
    };

    _proto.scroll = function scroll(index, force) {
      var _this = this;

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
      this.$wrapper.style.transform = this.getTransform(-offset);
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

      setTimeout(function () {
        _this.index = index;

        _this.updatePagination();
      }, this.config.speed);
      setTimeout(function () {
        _this.scrolling = false;
      }, this.config.speed + this.config.intermittent);
    };

    _proto.scrollPixel = function scrollPixel(px) {
      if (this.config.resistance) {
        if (px > 0 && this.index === 0) {
          px = Math.pow(px, this.config.resistanceRatio);
        } else if (px < 0 && this.index === this.maxIndex) {
          px = -1 * Math.pow(Math.abs(px), this.config.resistanceRatio);
        }
      }

      var oldTransform = getTranslate(this.$wrapper, this.isHorizontal);
      this.$wrapper.style.transform = this.getTransform(oldTransform + px);
    };

    _proto.initPagination = function initPagination() {
      var _this2 = this;

      var config = this.config;
      if (!config.pagination) return;
      var $pagination = typeof config.pagination.el === 'string' ? document.body.querySelector(config.pagination.el) : config.pagination.el;
      $pagination.innerHTML = '';
      var $pageList = [];
      var $group = document.createDocumentFragment();
      this.$pageList = $pageList;
      this.$list.forEach(function (item, index) {
        var $page = document.createElement('div');

        if (index === _this2.index) {
          $page.className = config.pagination.bulletClass + " " + config.pagination.bulletActiveClass;
        } else {
          $page.className = "" + config.pagination.bulletClass;
        }

        $pageList.push($page);
        $group.appendChild($page);
      });
      $pagination.appendChild($group);

      if (config.pagination.clickable) {
        $pagination.addEventListener('click', function (e) {
          if (_this2.scrolling) return;
          var index = $pageList.indexOf(e.target);
          if (index < 0) return;

          _this2.scroll(index);
        });
      }
    };

    _proto.initStatus = function initStatus() {
      this.touchStatus = {
        touchTracks: [],
        startOffset: 0,
        touchStartTime: 0,
        isTouchStart: false,
        isScrolling: false,
        isTouching: false
      };
    };

    _proto.initWheel = function initWheel() {
      var _this3 = this;

      var config = this.config,
          supportTouch = this.supportTouch;

      var handleTouchStart = function handleTouchStart(e) {
        _this3.initStatus();

        var touchStatus = _this3.touchStatus;

        var shouldPreventDefault = _this3.config.touchStartPreventDefault && _this3.formEls.indexOf(e.target.nodeName) === -1 || _this3.config.touchStartForcePreventDefault;

        touchStatus.startOffset = getTranslate(_this3.$wrapper, _this3.isHorizontal);
        _this3.$wrapper.style.transform = _this3.getTransform(touchStatus.startOffset);
        _this3.$wrapper.style.transition = 'none';
        touchStatus.isTouchStart = true;
        touchStatus.touchStartTime = Date.now();
        touchStatus.touchTracks.push({
          x: supportTouch ? e.touches[0].pageX : e.pageX,
          y: supportTouch ? e.touches[0].pageY : e.pageY
        });
        if (shouldPreventDefault && !_this3.config.passiveListeners) e.preventDefault();
      };

      var handleTouchMove = function handleTouchMove(e) {
        var config = _this3.config,
            touchStatus = _this3.touchStatus;
        if (!touchStatus.isTouchStart || touchStatus.isScrolling) return;
        if (config.touchMoveStopPropagation) e.stopPropagation();
        var currentPosition = {
          x: supportTouch ? e.touches[0].pageX : e.pageX,
          y: supportTouch ? e.touches[0].pageY : e.pageY
        };
        var diff = {
          x: currentPosition.x - touchStatus.touchTracks[touchStatus.touchTracks.length - 1].x,
          y: currentPosition.y - touchStatus.touchTracks[touchStatus.touchTracks.length - 1].y
        };
        touchStatus.touchTracks.push(currentPosition);
        var touchAngle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * 180 / Math.PI;
        var offset = 0;

        if (_this3.isHorizontal) {
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

        _this3.scrollPixel(offset * config.touchRatio);
      };

      var handleTouchEnd = function handleTouchEnd() {
        var touchStatus = _this3.touchStatus;
        var swipTime = Date.now() - touchStatus.touchStartTime;
        var computedOffset = getTranslate(_this3.$wrapper, _this3.isHorizontal) - touchStatus.startOffset;
        _this3.$wrapper.style.transition = "transform ease " + config.speed + "ms"; // long swip

        if (swipTime > _this3.config.longSwipesMs) {
          if (Math.abs(computedOffset) >= _this3.slideSize * _this3.config.longSwipesRatio) {
            if (computedOffset > 0) {
              _this3.scroll(_this3.index - 1, true);
            } else {
              _this3.scroll(_this3.index + 1, true);
            }
          } else {
            _this3.scroll(_this3.index, true);
          }
        } else {
          // short swip
          if (computedOffset > 0) {
            _this3.scroll(_this3.index - 1, true);
          } else if (computedOffset < 0) {
            _this3.scroll(_this3.index + 1, true);
          } else {
            _this3.scroll(_this3.index, true);
          }
        }

        _this3.initStatus();
      };

      if (supportTouch) {
        this.$el.addEventListener('touchstart', handleTouchStart, {
          passive: this.config.passiveListeners,
          capture: false
        }, false);
        this.$el.addEventListener('touchmove', handleTouchMove);
        this.$el.addEventListener('touchend', handleTouchEnd);
        this.$el.addEventListener('touchcancel', handleTouchEnd);
      } else {
        this.$el.addEventListener('mousedown', handleTouchStart);
        document.addEventListener('mousemove', handleTouchMove);
        document.addEventListener('mouseup', handleTouchEnd);
      }

      if (!config.mousewheel) return;
      var wheeling = false;
      var wheelDelta = 0;
      var wheelingTimer = false;
      this.$el.addEventListener('wheel', function (e) {
        var deltaY = e.deltaY;

        if ((Math.abs(deltaY) - Math.abs(wheelDelta) > 0 || !wheeling) && Math.abs(e.deltaY) >= config.mousewheel.sensitivity) {
          _this3.scroll(e.deltaY > 0 ? _this3.index - 1 : _this3.index + 1);
        }

        wheelDelta = deltaY;
        clearInterval(wheelingTimer);
        wheeling = true;
        wheelingTimer = setTimeout(function () {
          wheeling = false;
        }, 200);
        e.preventDefault();
        e.stopPropagation();
      });
    };

    _proto.updatePagination = function updatePagination() {
      var _this4 = this;

      var config = this.config;
      this.$pageList && this.$pageList.forEach(function ($page, index) {
        if (index === _this4.index) {
          $page.className = config.pagination.bulletClass + " " + config.pagination.bulletActiveClass;
        } else {
          $page.className = "" + config.pagination.bulletClass;
        }
      });
    };

    _proto.update = function update() {
      var _this5 = this;

      this.slideSize = this.isHorizontal ? this.$el.offsetWidth : this.$el.offsetHeight;
      this.$list.forEach(function (item) {
        if (_this5.isHorizontal) {
          item.style.width = _this5.slideSize + "px";
          item.style['margin-right'] = _this5.config.spaceBetween + "px";
        } else {
          item.style.height = _this5.slideSize + "px";
          item.style['margin-bottom'] = _this5.config.spaceBetween + "px";
        }
      });
      this.$wrapper.style.transition = "transform ease " + this.config.speed + "ms";

      if (this.isHorizontal) {
        this.$wrapper.style.width = this.boxSize * this.$list.length + "px";
      } else {
        this.$wrapper.style.height = this.boxSize * this.$list.length + "px";
      }

      this.$wrapper.style.display = 'flex';
      this.$wrapper.style['flex-direction'] = this.isHorizontal ? 'row' : 'column';
      var offset = this.index * this.boxSize;
      this.$wrapper.style.transform = this.getTransform(-offset);
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
