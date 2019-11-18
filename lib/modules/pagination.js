(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SwiperPluginPagination = factory());
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

  function TinySwiperPluginPagination(tinyswiper) {
    tinyswiper.on('before-init', function (tinyswiper) {
      var config = tinyswiper.config;

      if (config.pagination) {
        config.pagination = _extends({
          clickable: false,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }, config.pagination);
      }
    });
    tinyswiper.on('after-init', function (tinyswiper) {
      var config = tinyswiper.config;
      if (!config.pagination) return;
      var _config$pagination = config.pagination,
          bulletClass = _config$pagination.bulletClass,
          bulletActiveClass = _config$pagination.bulletActiveClass;
      var $pagination = typeof config.pagination.el === 'string' ? document.body.querySelector(config.pagination.el) : config.pagination.el;
      var $pageList = [];
      var $group = document.createDocumentFragment();
      config.excludeElements.push($pagination);
      tinyswiper.$pagination = $pagination;
      tinyswiper.$pageList = $pageList;
      tinyswiper.$list.forEach(function (item, index) {
        var $page = document.createElement('div');
        addClassName($page, index === tinyswiper.index ? [bulletClass, bulletActiveClass] : bulletClass);
        $pageList.push($page);
        $group.appendChild($page);
      });
      $pagination.appendChild($group);

      if (config.pagination.clickable) {
        $pagination.addEventListener('click', function (e) {
          tinyswiper.scroll($pageList.indexOf(e.target));
          e.stopPropagation();
        });
      }
    });
    tinyswiper.on('after-destroy', function (tinyswiper) {
      var config = tinyswiper.config;
      if (!config.pagination) return;
      tinyswiper.$pagination.innerHTML = '';
      tinyswiper.$pageList = [];
      tinyswiper.$pagination = null;
    });
    tinyswiper.on('after-slide', function (currentIndex, tinyswiper) {
      var bulletActiveClass = tinyswiper.config.pagination.bulletActiveClass;
      tinyswiper.$pageList && tinyswiper.$pageList.forEach(function ($page, index) {
        if (index === currentIndex) {
          addClassName($page, bulletActiveClass);
        } else {
          removeClassName($page, bulletActiveClass);
        }
      });
    });
  }

  return TinySwiperPluginPagination;

}));
//# sourceMappingURL=pagination.js.map
