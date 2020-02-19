(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.SwiperPluginLoop = factory());
}(this, (function () { 'use strict';

    function SwiperPluginLoop(instance, options) {
      function getExpand(element) {
        return options.slidesPerView >= element.$list.length ? options.slidesPerView - element.$list.length + 1 : 1;
      }

      if (!options.loop) return;
      instance.on('init-limitation', function (limitation, element, measure) {
        var $list = element.$list;
        var boxSize = measure.boxSize;
        var expand = getExpand(element);
        var base = -expand * boxSize;
        limitation.base += base;
        limitation.max += base;
        limitation.min += base;
        limitation.maxIndex = $list.length - (options.centeredSlides || options.loop ? 1 : Math.ceil(options.slidesPerView));
      });
      instance.on('init-layout', function (element) {
        var $list = element.$list,
            $wrapper = element.$wrapper;
        var expand = getExpand(element);
        var leftExpandList = $list.slice(-expand).map(function ($slide) {
          return $slide.cloneNode(true);
        });
        var rightExpandList = $list.slice(0, expand).map(function ($slide) {
          return $slide.cloneNode(true);
        });
        leftExpandList.forEach(function ($shadowSlide, index) {
          $wrapper.appendChild(rightExpandList[index]);
          $wrapper.insertBefore(leftExpandList[index], $list[0]);
        });
      });
      instance.on('before-slide', function (targetIndex, layout, limitation, measure, transform) {
        var boxSize = measure.boxSize;
        var computedIndex = targetIndex < limitation.minIndex ? limitation.minIndex : targetIndex > limitation.maxIndex ? limitation.maxIndex : targetIndex;
        var offset = -computedIndex * boxSize + limitation.base;
        transform(offset > limitation.max ? limitation.max : offset < limitation.min ? limitation.min : offset);
        index = computedIndex; // TODO
      });
      instance.on('after-slide', function () {});
    }

    return SwiperPluginLoop;

})));
//# sourceMappingURL=loop.js.map
