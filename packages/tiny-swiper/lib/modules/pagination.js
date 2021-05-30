(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SwiperPluginPagination = factory());
}(this, (function () { 'use strict';

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
    function stringToElement(string) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = string;
      return wrapper.firstChild;
    }

    var SwiperPluginPagination = (function SwiperPluginPagination(instance, options) {
      var isEnable = Boolean(options.pagination);
      var paginationOptions = Object.assign({
        clickable: false,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active',
        clickableClass: 'swiper-pagination-clickable'
      }, options.pagination);
      var paginationInstance = {
        $pageList: [],
        $pagination: null
      };
      if (!isEnable) return;
      instance.on('after-init', function () {
        var bulletClass = paginationOptions.bulletClass,
            bulletActiveClass = paginationOptions.bulletActiveClass,
            clickableClass = paginationOptions.clickableClass,
            renderBullet = paginationOptions.renderBullet;
        var element = instance.env.element;
        var $list = element.$list;
        var $pagination = typeof paginationOptions.el === 'string' ? document.body.querySelector(paginationOptions.el) : paginationOptions.el;
        var $pageList = [];
        var $group = document.createDocumentFragment();
        var dotCount = $list.length - Math.ceil(options.slidesPerView) + 1;
        options.excludeElements.push($pagination);
        paginationInstance.$pagination = $pagination;
        paginationInstance.$pageList = $pageList;

        for (var index = 0; index < dotCount; index++) {
          var $page = renderBullet ? stringToElement(renderBullet(index, bulletClass)) : document.createElement('div');
          addClass($page, index === instance.state.index ? [bulletClass, bulletActiveClass] : bulletClass);
          $pageList.push($page);
          $group.appendChild($page);
        }

        $pagination.appendChild($group);

        if (paginationOptions.clickable) {
          addClass($pagination, clickableClass);
          $pagination.addEventListener('click', function (e) {
            var target = e.target;
            if (!target) return;
            e.preventDefault();
            var bulletElement = target.closest("." + bulletClass);
            instance.slideTo($pageList.indexOf(bulletElement));
            e.stopPropagation();
          });
        }
      });
      instance.on('after-destroy', function () {
        if (!isEnable) return;
        paginationInstance.$pagination.innerHTML = '';
        paginationInstance.$pageList = [];
        paginationInstance.$pagination = null;
      });
      instance.on('after-slide', function (currentIndex) {
        var bulletActiveClass = paginationOptions.bulletActiveClass;
        paginationInstance.$pageList && paginationInstance.$pageList.forEach(function ($page, index) {
          if (index === currentIndex) {
            addClass($page, bulletActiveClass);
          } else {
            removeClass($page, bulletActiveClass);
          }
        });
      });
    });

    return SwiperPluginPagination;

})));
//# sourceMappingURL=pagination.js.map
