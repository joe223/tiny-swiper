(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SwiperPluginLazyload = factory());
}(this, (function () { 'use strict';

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

  function addClass(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return !el.classList.contains(clz) && el.classList.add(clz);
    });
  }
  function removeClass(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return el.classList.contains(clz) && el.classList.remove(clz);
    });
  }

  /**
   * TinySwiper plugin for image lazy loading.
   *
   * @param {SwiperInstance} instance
   * @param {Options}
   */

  function SwiperPluginLazyload(instance, options) {
    if (!options.lazyload) return;
    var lazyloadOptions = options.lazyload;
    var lazyload = {
      load: function load(index) {
        var $slide = instance.env.element.$list[index];
        if (!$slide) return;
        var $imgs = [].slice.call($slide.getElementsByClassName(lazyloadOptions.elementClass));
        var $preloaders = [].slice.call($slide.getElementsByClassName(lazyloadOptions.preloaderClass));

        function handleLoaded($img) {
          $img.removeAttribute('data-src');
          addClass($img, [lazyloadOptions.loadedClass]);
          removeClass($img, [lazyloadOptions.loadingClass]);
          $img.onload = null;
          $img.onerror = null;
          $img.isLoaded = true;

          if ($imgs.every(function (item) {
            return item.isLoaded;
          })) {
            $preloaders.forEach(function ($preloader) {
              $preloader.parentElement.removeChild($preloader);
            });
          }
        }

        $imgs.forEach(function ($img) {
          if (!$img.hasAttribute('data-src')) return;
          var src = $img.getAttribute('data-src');
          addClass($img, [lazyloadOptions.loadingClass]);
          removeClass($img, [lazyloadOptions.loadedClass]);
          $img.src = src;

          $img.onload = function () {
            return handleLoaded($img);
          };

          $img.onerror = function () {
            return handleLoaded($img);
          };
        });
      },
      loadRange: function loadRange(index, range) {
        lazyload.load(index);

        if (lazyloadOptions.loadPrevNext && range >= 1) {
          for (var i = 1; i <= range; i++) {
            lazyload.load(index + i);
            lazyload.load(index - i);
          }
        }
      }
    };
    instance.on('before-init', function () {
      options.lazyload = _extends({
        loadPrevNext: false,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: false,
        elementClass: 'swiper-lazy',
        loadingClass: 'swiper-lazy-loading',
        loadedClass: 'swiper-lazy-loaded',
        preloaderClass: 'swiper-lazy-preloader'
      }, options.lazyload);
    });

    if (lazyloadOptions.loadOnTransitionStart) {
      instance.on('before-slide', function (oldIndex, state, newIndex) {
        lazyload.loadRange(newIndex, lazyloadOptions.loadPrevNextAmount);
      });
    } else {
      instance.on('after-slide', function (index) {
        lazyload.loadRange(index, lazyloadOptions.loadPrevNextAmount);
      });
    }

    instance.on('after-destroy', function () {
      if (!instance.lazyload) return;
      delete instance.lazyload;
    });
  }

  return SwiperPluginLazyload;

})));
//# sourceMappingURL=lazyload.js.map
