(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SwiperPluginMousewheel = factory());
}(this, (function () { 'use strict';

    function attachListener(el, evtName, handler, opts) {
      el.addEventListener(evtName, handler, opts);
    }
    function detachListener(el, evtName, handler) {
      el.removeEventListener(evtName, handler);
    }

    function SwiperPluginMousewheel(instance, options) {
      var mousewheel = {
        $el: null
      };
      var wheelStatus = {
        wheeling: false,
        wheelDelta: 0,
        wheelingTimer: 0
      };

      var handler = function handler(e) {
        var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        var index = instance.state.index;

        if (Math.abs(delta) - Math.abs(wheelStatus.wheelDelta) > 0 && !wheelStatus.wheeling && Math.abs(delta) >= options.mousewheel.sensitivity) {
          var step = options.mousewheel.invert ? -1 : 1;
          instance.slideTo(delta > 0 ? index - step : index + step);
          wheelStatus.wheeling = true;
          wheelStatus.wheelingTimer = setTimeout(function () {
            wheelStatus.wheeling = false;
          }, options.mousewheel.interval);
        }

        wheelStatus.wheelDelta = delta;
        e.preventDefault();
        e.stopPropagation();
      };

      instance.on('before-init', function () {
        if (options.mousewheel) {
          options.mousewheel = Object.assign({
            invert: false,
            sensitivity: 1,
            interval: 400
          }, options.mousewheel);
        }
      });
      instance.on('after-init', function () {
        if (!options.mousewheel) return;
        var element = instance.env.element;
        var $el = element.$el;
        mousewheel.$el = $el;
        attachListener($el, 'wheel', handler);
      });
      instance.on('after-destroy', function () {
        if (!options.mousewheel) return;
        detachListener(mousewheel.$el, 'wheel', handler);
        delete mousewheel.$el;
      });
    }

    return SwiperPluginMousewheel;

})));
//# sourceMappingURL=mousewheel.js.map
