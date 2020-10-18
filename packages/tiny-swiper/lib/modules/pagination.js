(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SwiperPluginPagination = factory());
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

  function SwiperPluginPagination(instance, options) {
    var pagination = {
      $pageList: [],
      $pagination: null
    };
    instance.on('before-init', function () {
      if (options.pagination) {
        options.pagination = _extends({
          clickable: false,
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }, options.pagination);
      }
    });
    instance.on('after-init', function () {
      if (!options.pagination) return;
      var _options$pagination = options.pagination,
          bulletClass = _options$pagination.bulletClass,
          bulletActiveClass = _options$pagination.bulletActiveClass;
      var element = instance.env.element;
      var $list = element.$list;
      var $pagination = typeof options.pagination.el === 'string' ? document.body.querySelector(options.pagination.el) : options.pagination.el;
      var $pageList = [];
      var $group = document.createDocumentFragment();
      options.excludeElements.push($pagination);
      pagination.$pagination = $pagination;
      pagination.$pageList = $pageList;
      $list.forEach(function (item, index) {
        var $page = document.createElement('div');
        addClass($page, index === instance.state.index ? [bulletClass, bulletActiveClass] : bulletClass);
        $pageList.push($page);
        $group.appendChild($page);
      });
      $pagination.appendChild($group);

      if (options.pagination.clickable) {
        $pagination.addEventListener('click', function (e) {
          instance.slideTo($pageList.indexOf(e.target));
          e.stopPropagation();
        });
      }
    });
    instance.on('after-destroy', function () {
      if (!options.pagination) return;
      pagination.$pagination.innerHTML = '';
      pagination.$pageList = [];
      pagination.$pagination = null;
    });
    instance.on('after-slide', function (currentIndex) {
      var bulletActiveClass = options.pagination.bulletActiveClass;
      pagination.$pageList && pagination.$pageList.forEach(function ($page, index) {
        if (index === currentIndex) {
          addClass($page, bulletActiveClass);
        } else {
          removeClass($page, bulletActiveClass);
        }
      });
    });
  }

  return SwiperPluginPagination;

})));
//# sourceMappingURL=pagination.js.map
