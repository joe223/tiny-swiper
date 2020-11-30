(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.SwiperPluginMousewheel = factory());
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

      var initWheelStatus = function initWheelStatus() {
        wheelStatus.wheeling = false;
        wheelStatus.wheelDelta = 0;
        wheelStatus.wheelingTimer = 0;
      };

      var handler = function handler(e) {
        var delta = options.isHorizontal ? e.deltaX : e.deltaY;
        var index = instance.state.index;

        if ((Math.abs(delta) - Math.abs(wheelStatus.wheelDelta) > 0 || !wheelStatus.wheeling) && Math.abs(delta) >= options.mousewheel.sensitivity) {
          instance.slideTo(delta > 0 ? index - 1 : index + 1);
        }

        wheelStatus.wheelDelta = delta;
        clearTimeout(wheelStatus.wheelingTimer);
        wheelStatus.wheeling = true;
        wheelStatus.wheelingTimer = setTimeout(function () {
          initWheelStatus();
        }, 200);
        e.preventDefault();
        e.stopPropagation();
      };

      instance.on('before-init', function () {
        if (options.mousewheel) {
          options.mousewheel = Object.assign({
            invert: false,
            sensitivity: 1
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
      });
    }

    return SwiperPluginMousewheel;

})));
//# sourceMappingURL=mousewheel.js.map
