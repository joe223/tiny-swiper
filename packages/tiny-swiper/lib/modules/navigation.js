(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SwiperPluginNavigation = factory());
}(this, (function () { 'use strict';

    function attachListener(el, evtName, handler, opts) {
      el.addEventListener(evtName, handler, opts);
    }
    function detachListener(el, evtName, handler) {
      el.removeEventListener(evtName, handler);
    }

    function SwiperPluginNavigation(instance, options) {
      var navigation = {
        nextEl: null,
        prevEl: null
      };

      var nextClickHandler = function nextClickHandler(e) {
        clickHandler(e.target, 'next');
      };

      var prevClickHandler = function prevClickHandler(e) {
        clickHandler(e.target, 'prev');
      };

      var clickHandler = function clickHandler(e, type) {
        if (checkIsDisable(e) && !instance.options.loop) {
          return;
        }

        var index = instance.state.index;

        if (type === 'next') {
          instance.slideTo(index + 1);
        }

        if (type === 'prev') {
          instance.slideTo(index - 1);
        }
      };

      var checkNavBtnDisabledClass = function checkNavBtnDisabledClass(index) {
        var _instance$env$limitat = instance.env.limitation,
            minIndex = _instance$env$limitat.minIndex,
            maxIndex = _instance$env$limitat.maxIndex;

        if (navigation && navigation.nextEl) {
          if (navigation.nextEl.classList.contains(options.navigation.disabledClass) && index > minIndex) {
            navigation.nextEl.classList.remove(options.navigation.disabledClass);
          }

          if (navigation.prevEl.classList.contains(options.navigation.disabledClass) && index < maxIndex) {
            navigation.prevEl.classList.remove(options.navigation.disabledClass);
          }

          if (index === minIndex) {
            navigation.prevEl.classList.add(options.navigation.disabledClass);
          }

          if (index === maxIndex) {
            navigation.nextEl.classList.add(options.navigation.disabledClass);
          }
        }
      };

      var checkIsDisable = function checkIsDisable(e) {
        return e.classList.contains(options.navigation.disabledClass);
      };

      var checkButtonDefaultStatus = function checkButtonDefaultStatus() {
        var index = instance.state.index;
        var $list = instance.env.element.$list;
        var minIndex = instance.env.limitation.minIndex;

        if (index === minIndex) {
          navigation.prevEl.classList.add(options.navigation.disabledClass);
        }

        if ($list.length === minIndex) {
          navigation.nextEl.classList.add(options.navigation.disabledClass);
        }
      };

      instance.on('before-slide', function (currentIndex, state, newIndex) {
        if (!instance.options.loop) {
          checkNavBtnDisabledClass(newIndex);
        }
      });
      instance.on('before-init', function () {
        if (options.navigation) {
          options.navigation = Object.assign({
            disabledClass: 'swiper-button-disabled'
          }, options.navigation);
        }
      });
      instance.on('after-init', function () {
        if (!options.navigation) return;
        navigation.nextEl = typeof options.navigation.nextEl === 'string' ? document.body.querySelector(options.navigation.nextEl) : options.navigation.nextEl;
        navigation.prevEl = typeof options.navigation.prevEl === 'string' ? document.body.querySelector(options.navigation.prevEl) : options.navigation.prevEl;

        if (!instance.options.loop) {
          checkButtonDefaultStatus();
        }

        attachListener(navigation.nextEl, 'click', nextClickHandler);
        attachListener(navigation.prevEl, 'click', prevClickHandler);
      });
      instance.on('after-destroy', function () {
        if (!options.navigation) return;
        detachListener(navigation.nextEl, 'click', nextClickHandler);
        detachListener(navigation.prevEl, 'click', prevClickHandler);
        delete navigation.nextEl;
        delete navigation.prevEl;
      });
    }

    return SwiperPluginNavigation;

})));
//# sourceMappingURL=navigation.js.map
