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

    var SwiperPluginNavigation = (function SwiperPluginNavigation(instance, options) {
      var isEnable = Boolean(options.navigation);
      var navigationInstance = {
        nextEl: null,
        prevEl: null
      };
      var navigationOptions = Object.assign({
        disabledClass: 'swiper-button-disabled'
      }, options.navigation);

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

        if (navigationInstance && navigationInstance.prevEl && navigationInstance.nextEl) {
          if (navigationInstance.nextEl.classList.contains(navigationOptions.disabledClass) && index >= minIndex) {
            navigationInstance.nextEl.classList.remove(navigationOptions.disabledClass);
          }

          if (navigationInstance.prevEl.classList.contains(navigationOptions.disabledClass) && index <= maxIndex) {
            navigationInstance.prevEl.classList.remove(navigationOptions.disabledClass);
          }

          if (index === minIndex) {
            navigationInstance.prevEl.classList.add(navigationOptions.disabledClass);
          }

          if (index === maxIndex) {
            navigationInstance.nextEl.classList.add(navigationOptions.disabledClass);
          }
        }
      };

      var checkIsDisable = function checkIsDisable(e) {
        return e.classList.contains(navigationOptions.disabledClass);
      };

      var checkButtonDefaultStatus = function checkButtonDefaultStatus() {
        var index = instance.state.index;
        var $list = instance.env.element.$list;
        var minIndex = instance.env.limitation.minIndex;

        if (index === minIndex && navigationInstance.prevEl) {
          navigationInstance.prevEl.classList.add(navigationOptions.disabledClass);
        }

        if ($list.length === minIndex && navigationInstance.nextEl) {
          navigationInstance.nextEl.classList.add(navigationOptions.disabledClass);
        }
      };

      instance.on('before-slide', function (currentIndex, state, newIndex) {
        if (!instance.options.loop) {
          checkNavBtnDisabledClass(newIndex);
        }
      });
      instance.on('after-init', function () {
        if (!isEnable) return;
        navigationInstance.nextEl = typeof navigationOptions.nextEl === 'string' ? document.body.querySelector(navigationOptions.nextEl) : navigationOptions.nextEl;
        navigationInstance.prevEl = typeof navigationOptions.prevEl === 'string' ? document.body.querySelector(navigationOptions.prevEl) : navigationOptions.prevEl;

        if (!instance.options.loop) {
          checkButtonDefaultStatus();
        }

        attachListener(navigationInstance.nextEl, 'click', nextClickHandler);
        attachListener(navigationInstance.prevEl, 'click', prevClickHandler);
      });
      instance.on('after-destroy', function () {
        if (navigationInstance && navigationInstance.prevEl && navigationInstance.nextEl) {
          detachListener(navigationInstance.nextEl, 'click', nextClickHandler);
          detachListener(navigationInstance.prevEl, 'click', prevClickHandler);
          delete navigationInstance.nextEl;
          delete navigationInstance.prevEl;
        }
      });
    });

    return SwiperPluginNavigation;

})));
//# sourceMappingURL=navigation.js.map
