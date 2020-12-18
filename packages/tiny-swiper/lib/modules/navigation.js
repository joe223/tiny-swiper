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
        var currentIdx = index;

        if (type === 'next') {
          if (index < $list.length - 1) {
            instance.slideTo(index + 1);
          }

          if (currentIdx > $list.length) {
            currentIdx = index;
          }

          currentIdx++;
        }

        if (type === 'prev') {
          if (index > 0) {
            instance.slideTo(index - 1);
          }

          if (currentIdx < -1) {
            currentIdx = index;
          }

          currentIdx--;
        }

        console.log(instance.options.loop, currentIdx, type);
        checkSwiperDisabledClass(currentIdx, $list.length - 1, type);
      };

      var checkSwiperDisabledClass = function checkSwiperDisabledClass(index, last, type) {
        var target = type === 'prev' ? -1 : last + 1;
        var slideToNum = type === 'prev' ? last : 0;

        if (navigation.nextEl.classList.contains(options.navigation.disabledClass) && type === 'prev') {
          navigation.nextEl.classList.remove(options.navigation.disabledClass);
        }

        if (navigation.prevEl.classList.contains(options.navigation.disabledClass) && type === 'next') {
          navigation.prevEl.classList.remove(options.navigation.disabledClass);
        }

        if (instance.options.loop) {
          if (index === target) {
            instance.slideTo(slideToNum);
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

      var checkIsDisable = function checkIsDisable(e) {
        if (e.classList.contains(options.navigation.disabledClass)) {
          return true;
        }

        return false;
      };

      var checkButtonDefaultStatus = function checkButtonDefaultStatus() {
        var index = instance.state.index;
        var $list = instance.env.element.$list;

        if (index === 0 && !instance.options.loop) {
          navigation.prevEl.classList.add(options.navigation.disabledClass);
        }

        if ($list.length === 1 && !instance.options.loop) {
          navigation.nextEl.classList.add(options.navigation.disabledClass);
        }
      };

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
        checkButtonDefaultStatus();
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
