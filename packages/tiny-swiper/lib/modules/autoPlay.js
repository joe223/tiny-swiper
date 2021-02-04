(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SwiperPluginAutoPlay = factory());
}(this, (function () { 'use strict';

    function attachListener(el, evtName, handler, opts) {
      el.addEventListener(evtName, handler, opts);
    }
    function detachListener(el, evtName, handler) {
      el.removeEventListener(evtName, handler);
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

    /**
     * TinySwiper plugin for auto paly.
     *
     * @param {SwiperInstance} instance
     * @param {Options}
     */

    var SwiperPluginAutoPlay = (function SwiperPluginAutoPlay(instance, options) {
      var isEnable = Boolean(options.autoplay);
      if (!isEnable) return;
      var autoPlayOptions = Object.assign({
        delay: 3000,
        disableOnInteraction: true,
        reverseDirection: false,
        stopOnLastSlide: false,
        waitForTransition: true
      }, options.autoplay);
      var hook = autoPlayOptions.waitForTransition ? LIFE_CYCLES.AFTER_SLIDE : LIFE_CYCLES.BEFORE_SLIDE;
      var touchable = instance.env.touchable;
      var $el = instance.env.element.$el;
      var autoPlayState = {
        pause: false,
        timeoutId: void 0
      };

      function play() {
        var state = instance.state,
            env = instance.env;

        if (!(autoPlayOptions.stopOnLastSlide && state.index >= env.limitation.maxIndex) && !autoPlayState.pause && !autoPlayState.timeoutId) {
          autoPlayState.timeoutId = setTimeout(function () {
            var newIndex = autoPlayOptions.reverseDirection ? state.index - 1 : state.index + 1;
            var computedIndex = newIndex > env.limitation.maxIndex ? env.limitation.minIndex : newIndex < env.limitation.minIndex ? env.limitation.maxIndex : newIndex;
            instance.slideTo(computedIndex);
            autoPlayState.timeoutId = void 0;
          }, autoPlayOptions.delay);
        }
      }

      function onTouchStart() {
        clearTimeout(autoPlayState.timeoutId);
        autoPlayState.pause = true;
        autoPlayState.timeoutId = void 0;
      }

      function onTouchEnd() {
        autoPlayState.pause = false;
        play();
      }

      instance.on(hook, play);
      instance.on(LIFE_CYCLES.AFTER_INIT, function () {
        if (touchable) {
          attachListener($el, 'touchstart', onTouchStart);
          attachListener($el, 'touchend', onTouchEnd);
          attachListener($el, 'touchcancel', onTouchEnd);
        } else {
          attachListener($el, 'mousedown', onTouchStart);
          attachListener(document, 'mouseup', onTouchEnd);
        }
      });
      instance.on(LIFE_CYCLES.AFTER_DESTROY, function () {
        if (touchable) {
          detachListener($el, 'touchstart', onTouchStart);
          detachListener($el, 'touchend', onTouchEnd);
          detachListener($el, 'touchcancel', onTouchEnd);
        } else {
          detachListener($el, 'mousedown', onTouchStart);
          detachListener(document, 'mouseup', onTouchEnd);
        }
      });
    });

    return SwiperPluginAutoPlay;

})));
//# sourceMappingURL=autoPlay.js.map
