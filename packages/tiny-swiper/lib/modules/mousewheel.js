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

    var SwiperPluginMousewheel = (function SwiperPluginMousewheel(instance, options) {
      var isEnable = Boolean(options.mousewheel);
      var mousewheelOptions = Object.assign({
        invert: false,
        sensitivity: 1,
        interval: 400
      }, options.mousewheel);
      var mousewheelInstance = {
        $el: null
      };
      var wheelStatus = {
        wheeling: false,
        wheelDelta: 0,
        wheelingTimer: 0
      };

      var handler = function handler(e) {
        var isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if (options.isHorizontal !== isHorizontal) return;
        var delta = isHorizontal ? e.deltaX : e.deltaY;
        var index = instance.state.index;

        if (Math.abs(delta) - Math.abs(wheelStatus.wheelDelta) > 0 && !wheelStatus.wheeling && Math.abs(delta) >= mousewheelOptions.sensitivity) {
          var step = mousewheelOptions.invert ? 1 : -1;
          instance.slideTo(delta > 0 ? index - step : index + step);
          wheelStatus.wheeling = true;
          wheelStatus.wheelingTimer = setTimeout(function () {
            wheelStatus.wheeling = false;
          }, mousewheelOptions.interval);
        }

        wheelStatus.wheelDelta = delta;
        e.preventDefault();
        e.stopPropagation();
      };

      instance.on('after-init', function () {
        if (!isEnable) return;
        var element = instance.env.element;
        var $el = element.$el;
        mousewheelInstance.$el = $el;
        attachListener($el, 'wheel', handler);
      });
      instance.on('after-destroy', function () {
        if (!isEnable) return;
        detachListener(mousewheelInstance.$el, 'wheel', handler);
        delete mousewheelInstance.$el;
      });
    });

    return SwiperPluginMousewheel;

})));
//# sourceMappingURL=mousewheel.js.map
