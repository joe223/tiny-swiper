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
        var $list = instance.env.element.$list;

        if (type === 'next') {
          instance.slideTo(index + 1);
        }

        if (type === 'prev') {
          instance.slideTo(index - 1);
        }
      };

      var checkSwiperDisabledClass = function checkSwiperDisabledClass(index, last) {
        if (instance.options.loop) {
          if (index === 0) {
            instance.slideTo(last);
          }

          if (index === last) {
            instance.slideTo(0);
          }
        } else {
          if (instance.state.index === 0) {
            navigation.prevEl.classList.add(options.navigation.disabledClass);
          }

          if (instance.state.index === last) {
            navigation.nextEl.classList.add(options.navigation.disabledClass);
          }
        }
      };

      var checkNavBtnDisabledClass = function checkNavBtnDisabledClass(index, last) {
        if (navigation && navigation.nextEl) {
          if (navigation.nextEl.classList.contains(options.navigation.disabledClass) && index > 0) {
            navigation.nextEl.classList.remove(options.navigation.disabledClass);
          }

          if (navigation.prevEl.classList.contains(options.navigation.disabledClass) && index < last) {
            navigation.prevEl.classList.remove(options.navigation.disabledClass);
          }
        }
      };

      var checkIsDisable = function checkIsDisable(e) {
        if (e.classList.contains(options.navigation.disabledClass)) {
          return true;
        }

        return false;
      };

      var checkButtonDefaultStatus = function checkButtonDefaultStatus() {
        var index = instance.state.index;
        var $list = instance.env.element.$list;

        if (index === 0) {
          navigation.prevEl.classList.add(options.navigation.disabledClass);
        }

        if ($list.length === 1) {
          navigation.nextEl.classList.add(options.navigation.disabledClass);
        }
      };

      instance.on('after-slide', function (currentIndex) {
        checkSwiperDisabledClass(currentIndex, instance.env.element.$list.length - 1);
      });
      instance.on('before-slide', function (currentIndex, state, newIndex) {
        checkNavBtnDisabledClass(newIndex, instance.env.element.$list.length - 1);
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
        delete navigation.nextEl;
        delete navigation.prevEl;
        detachListener(navigation.nextEl, 'click', nextClickHandler);
        detachListener(navigation.prevEl, 'click', prevClickHandler);
      });
    }

    return SwiperPluginNavigation;

})));
//# sourceMappingURL=navigation.js.map
