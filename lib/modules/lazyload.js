(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SwiperPluginLazyload = factory());
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

  function addClassName(el, list) {
    if (list === void 0) {
      list = [];
    }

    if (!Array.isArray(list)) list = [list];
    list.forEach(function (clz) {
      return !el.classList.contains(clz) && el.classList.add(clz);
    });
  }
  function removeClassName(el, list) {
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
   * @param {*} tinyswiper
   */

  function TinySwiperPluginLazyload(instance) {
    var config = instance.config;
    if (!config.lazyload) return;
    instance.lazyload = {
      load: function load(index) {
        var $slide = instance.$list[index];
        if (!$slide) return;
        var $imgs = [].slice.call($slide.getElementsByClassName(config.lazyload.elementClass));
        var $preloaders = [].slice.call($slide.getElementsByClassName(config.lazyload.preloaderClass));

        function handleLoaded($img) {
          $img.removeAttribute('data-src');
          addClassName($img, [config.lazyload.loadedClass]);
          removeClassName($img, [config.lazyload.loadingClass]);
          $img.onloaded = null;
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
          addClassName($img, [config.lazyload.loadingClass]);
          removeClassName($img, [config.lazyload.loadedClass]);
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
        instance.lazyload.load(index);

        if (config.lazyload.loadPrevNext && range >= 1) {
          for (var i = 1; i <= range; i++) {
            instance.lazyload.load(index + i);
            instance.lazyload.load(index - i);
          }
        }
      }
    };
    instance.on('before-init', function () {
      config.lazyload = _extends({
        loadPrevNext: false,
        loadPrevNextAmount: 1,
        loadOnTransitionStart: false,
        elementClass: 'swiper-lazy',
        loadingClass: 'swiper-lazy-loading',
        loadedClass: 'swiper-lazy-loaded',
        preloaderClass: 'swiper-lazy-preloader'
      }, config.lazyload);
    });

    if (config.lazyload.loadOnTransitionStart) {
      instance.on('before-slide', function (oldIndex, tinyswiper, newIndex) {
        tinyswiper.lazyload.loadRange(newIndex, config.lazyload.loadPrevNextAmount);
      });
    } else {
      instance.on('after-slide', function (index, tinyswiper) {
        tinyswiper.lazyload.loadRange(index, config.lazyload.loadPrevNextAmount);
      });
    }

    instance.on('after-destroy', function (tinyswiper) {
      if (!tinyswiper.config.lazyload) return;
      delete tinyswiper.lazyload;
    });
  }

  return TinySwiperPluginLazyload;

}));
//# sourceMappingURL=lazyload.js.map
