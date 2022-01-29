(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SwiperPluginBreakpoints = factory());
}(this, (function () { 'use strict';

    function now() {
      return performance ? performance.now() : Date.now();
    }
    function debounce(fn, threshold, opt) {
      if (threshold === void 0) {
        threshold = 200;
      }

      if (opt === void 0) {
        opt = {
          trailing: true
        };
      }

      var lastCallTime = 0;
      var lastResult;
      var lastTimer;
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var currTime = now();

        if (currTime - lastCallTime >= threshold) {
          lastCallTime = currTime;
          lastTimer = void 0;
          lastResult = fn.apply(void 0, args);
        }

        if (opt.trailing) {
          lastTimer && clearTimeout(lastTimer);
          lastTimer = setTimeout(function () {
            return fn.apply(void 0, args);
          }, threshold);
        }

        return lastResult;
      };
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

    var nextFrame = requestAnimationFrame || webkitRequestAnimationFrame || setTimeout;
    var cancelNextFrame = cancelAnimationFrame || webkitCancelAnimationFrame || clearTimeout;

    /**
     * TinySwiper plugin for breakpoints.
     *
     * @param {SwiperInstance} instance
     * @param {Options}
     */

    var SwiperPluginBreakpoints = (function SwiperPluginBreakpoints(instance, options) {
      var isEnabled = Boolean(options.breakpoints);
      var breakpoints = {
        update: function update() {
          if (!options.breakpoints) return;

          for (var _i = 0, _Object$entries = Object.entries(options.breakpoints); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _Object$entries[_i],
                breakpoint = _Object$entries$_i[0],
                values = _Object$entries$_i[1];

            if ('window' === options.breakpointsBase) {
              if (window.matchMedia("(min-width: " + breakpoint + "px)").matches) {
                instance.options = Object.assign(instance.options, values);
              }
            } else if (+breakpoint <= instance.env.element.$el.offsetWidth) {
              instance.options = Object.assign(instance.options, values);
            }
          }

          nextFrame(instance.updateSize);
        }
      };
      if (!isEnabled) return;
      var resizeListener = debounce(breakpoints.update, 200); // the default timeout is 200ms

      instance.on(LIFE_CYCLES.AFTER_INIT, function () {
        instance.breakpoints = breakpoints;
        window.addEventListener('resize', resizeListener, {
          passive: true
        });
      });
      instance.on(LIFE_CYCLES.BEFORE_DESTROY, function () {
        window.removeEventListener('resize', resizeListener);
      });
    });

    return SwiperPluginBreakpoints;

})));
//# sourceMappingURL=breakpoints.js.map
