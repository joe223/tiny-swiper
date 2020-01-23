(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SwiperPluginKeyboardControl = factory());
}(this, function () { 'use strict';

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

  function attachListener(el, evtName, handler, opts) {
    el.addEventListener(evtName, handler, opts);
  }
  function detachListener(el, evtName, handler) {
    el.removeEventListener(evtName, handler);
  }

  var DIRECTION = {
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
    left: 'ArrowLeft'
  };

  function isVisible(el) {
    if (!el) return false;
    var style = getComputedStyle(el);
    var visible = style.visibility !== 'hidden' && style.display !== 'none';
    if (!visible) return false;
    return el.parentElement && el.parentElement.nodeType === 1 ? isVisible(el.parentElement) : true;
  }

  function isElementInView(el) {
    var visibility = isVisible(el);
    var boundary = el.getBoundingClientRect();
    var isInView = boundary.top >= 0 && boundary.bottom <= window.innerHeight && boundary.left >= 0 && boundary.right <= window.innerWidth;
    return isInView && visibility;
  }
  /**
   * TinySwiper plugin for keyboard control.
   *
   * @param {TinySwiper} instance
   */


  function SwiperPluginKeyboardControl(instance) {
    var config = instance.config;
    if (!config.keyboard) return;
    instance.keyboard = {
      enable: function enable() {
        instance.config.keyboard.enabled = true;
      },
      disable: function disable() {
        instance.config.keyboard.enabled = false;
      },
      onKeyDown: function onKeyDown(e) {
        var key = e.key;
        if (instance.config.keyboard.onlyInViewport && !isElementInView(instance.$el) || !instance.config.keyboard.enabled) return;

        if (instance.isHorizontal) {
          if (key === DIRECTION.left) {
            instance.scroll(instance.index - 1);
          } else if (key === DIRECTION.right) {
            instance.scroll(instance.index + 1);
          }
        } else {
          if (key === DIRECTION.down) {
            instance.scroll(instance.index - 1);
          } else if (key === DIRECTION.up) {
            instance.scroll(instance.index + 1);
          }
        }
      }
    };
    instance.on('before-init', function (tinyswiper) {
      config.keyboard = _extends({
        enabled: true,
        onlyInViewport: true
      }, config.keyboard);
      attachListener(window, 'keydown', tinyswiper.keyboard.onKeyDown);
    });
    instance.on('after-destroy', function (tinyswiper) {
      if (!tinyswiper.keyboard) return;
      detachListener(window, 'keydown', tinyswiper.keyboard.onKeyDown);
      delete tinyswiper.keyboard;
    });
  }

  return SwiperPluginKeyboardControl;

}));
//# sourceMappingURL=keyboardControl.js.map
