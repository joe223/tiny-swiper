(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Swiper = factory());
}(this, (function () { 'use strict';

    const defaultOptions = {
        // `isHorizontal` is computed value
        direction: 'horizontal',
        touchRatio: 1,
        touchAngle: 45,
        longSwipesRatio: 0.5,
        initialSlide: 0,
        loop: false,
        freeMode: false,
        mousewheel: false,
        pagination: false,
        passiveListeners: true,
        resistance: true,
        resistanceRatio: 0.85,
        speed: 300,
        longSwipesMs: 300,
        intermittent: 0,
        spaceBetween: 0,
        slidesPerView: 1,
        centeredSlides: false,
        slidePrevClass: 'swiper-slide-prev',
        slideNextClass: 'swiper-slide-next',
        slideActiveClass: 'swiper-slide-active',
        slideClass: 'swiper-slide',
        wrapperClass: 'swiper-wrapper',
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchMoveStopPropagation: false,
        excludeElements: []
    };
    function optionFormatter(userOptions) {
        const options = Object.assign(Object.assign({}, defaultOptions), userOptions);
        return Object.assign(Object.assign({}, options), { isHorizontal: options.direction === 'horizontal' });
    }
    //# sourceMappingURL=options.js.map

    function EventHub() {
        let hub = {};
        function on(evtName, cb) {
            if (!hub[evtName]) {
                hub[evtName] = [cb];
            }
            else {
                hub[evtName].push(cb);
            }
        }
        function off(evtName, cb) {
            if (hub[evtName]) {
                const index = hub[evtName].indexOf(cb);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                index > -1 && hub[evtName].splice(index, 1);
            }
        }
        function emit(evtName, ...data) {
            if (hub[evtName]) {
                hub[evtName].forEach(cb => cb(...data));
            }
        }
        function clear() {
            hub = {};
        }
        return {
            on,
            off,
            emit,
            clear
        };
    }
    //# sourceMappingURL=eventHub.js.map

    const delta = 180 / Math.PI;
    function Vector(logs, index) {
        const trace = logs[index];
        const formerTrace = logs[index - 1];
        const diff = {
            x: trace.x - formerTrace.x,
            y: trace.y - formerTrace.y
        };
        const duration = trace.time - formerTrace.time;
        const velocityX = diff.x / duration;
        const velocityY = diff.y / duration;
        const angle = Math.atan2(Math.abs(diff.y), Math.abs(diff.x)) * delta;
        return Object.assign(Object.assign({}, diff), { angle,
            velocityX,
            velocityY });
    }
    function Tracker() {
        let logs = [];
        function push(position) {
            logs.push(Object.assign(Object.assign({}, position), { time: Date.now() }));
        }
        function vector() {
            return Vector(logs, logs.length - 1);
        }
        function clear() {
            logs = [];
        }
        function getLogs() {
            return logs;
        }
        function getDuration() {
            const first = logs[0];
            const last = logs[logs.length - 1];
            return first ? last.time - first.time : 0;
        }
        function getOffset() {
            const first = logs[0];
            const last = logs[logs.length - 1];
            return first ? {
                x: last.x - first.x,
                y: last.y - first.y
            } : {
                x: 0,
                y: 0
            };
        }
        return {
            getDuration,
            getOffset,
            getLogs,
            vector,
            clear,
            push
        };
    }
    //# sourceMappingURL=trace.js.map

    function Engine(limitation, options, measure, renderer, eventHub) {
        const { boxSize } = measure;
        const tracker = Tracker();
        let index = 0;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        let status = initStatus();
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        let layout = initLayout(0);
        function render(duration) {
            renderer.render({
                index,
                status,
                layout,
                duration
            });
        }
        function transform(trans) {
            layout.transform = trans;
        }
        function slideTo(targetIndex, duration) {
            const computedIndex = targetIndex < limitation.minIndex
                ? limitation.minIndex
                : targetIndex > limitation.maxIndex
                    ? limitation.maxIndex
                    : targetIndex;
            const offset = -computedIndex * boxSize + limitation.base;
            transform(offset > limitation.max
                ? limitation.max
                : offset < limitation.min
                    ? limitation.min
                    : offset);
            index = computedIndex;
            render(duration);
        }
        function scrollPixel(px) {
            const ratio = Number(px.toExponential().split('e')[1]);
            const expand = ratio <= 0 ? Math.pow(10, -(ratio - 1)) : 1;
            const oldTransform = layout.transform;
            if (options.resistance && !options.loop) {
                if (px > 0 && oldTransform >= limitation.max) {
                    px -= Math.pow((px * expand), options.resistanceRatio) / expand;
                }
                else if (px < 0 && oldTransform <= limitation.min) {
                    px += (Math.pow((-px * expand), options.resistanceRatio)) / expand;
                }
            }
            layout.transform += px;
        }
        function initStatus(startTransform = 0) {
            return {
                startTransform,
                isStart: false,
                isScrolling: false,
                isTouching: false
            };
        }
        function initLayout(originTransform) {
            return {
                transform: originTransform
            };
        }
        function preheat(originPosition, originTransform) {
            tracker.push(originPosition);
            layout = initLayout(originTransform);
            status = initStatus(originTransform);
            status.isStart = true;
            render();
        }
        function move(position, trailingCall) {
            if (!status.isStart || status.isScrolling)
                return;
            tracker.push(position);
            const vector = tracker.vector();
            let offset = 0;
            if (options.isHorizontal) {
                if (vector.angle < options.touchAngle || status.isTouching) {
                    status.isTouching = true;
                    offset = vector.x * options.touchRatio;
                }
                else {
                    status.isScrolling = true;
                }
            }
            else {
                if ((90 - vector.angle) < options.touchAngle || status.isTouching) {
                    status.isTouching = true;
                    offset = vector.y * options.touchRatio;
                }
                else {
                    status.isScrolling = true;
                }
            }
            scrollPixel(offset);
            render();
            trailingCall && trailingCall(status);
        }
        function stop() {
            const duration = tracker.getDuration();
            const trans = layout.transform - status.startTransform;
            const jump = Math.ceil(Math.abs(trans) / boxSize);
            const longSwipeIndex = Math.ceil(Math.abs(trans) / boxSize - options.longSwipesRatio);
            status.isStart = false;
            // TODO: loop, limitation
            // long siwpe
            if (duration > options.longSwipesMs) {
                slideTo(index + longSwipeIndex * (trans > 0 ? -1 : 1));
            }
            else {
                // short swipe
                slideTo(trans > 0 ? index - jump : index + jump);
            }
            tracker.clear();
            status = initStatus();
        }
        function getStatus() {
            return Object.assign(Object.assign({ index }, status), layout);
        }
        slideTo(options.initialSlide, 0);
        return {
            preheat,
            move,
            stop,
            slideTo,
            getStatus
        };
    }
    //# sourceMappingURL=index.js.map

    function Element(el, options) {
        const $el = (typeof el === 'string' ? document.body.querySelector(el) : el);
        const $wrapper = $el.querySelector(`.${options.wrapperClass}`);
        const $list = [].slice.call($el.getElementsByClassName(options.slideClass));
        return {
            $el,
            $wrapper,
            $list
        };
    }
    //# sourceMappingURL=element.js.map

    function addClass(el, list = []) {
        if (!Array.isArray(list))
            list = [list];
        list.forEach(clz => (!el.classList.contains(clz) && el.classList.add(clz)));
    }
    function removeClass(el, list = []) {
        if (!Array.isArray(list))
            list = [list];
        list.forEach(clz => (el.classList.contains(clz) && el.classList.remove(clz)));
    }
    function attachListener(el, evtName, handler, opts) {
        el.addEventListener(evtName, handler, opts);
    }
    function detachListener(el, evtName, handler) {
        el.removeEventListener(evtName, handler);
    }
    function updateStyle(el, style, forceRender) {
        Object.keys(style).forEach(prop => {
            // TS7015: Element implicitly has an 'any' type because index expression is not of type 'number'.
            el.style[prop] = style[prop];
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        forceRender && getComputedStyle(el);
    }
    function getTranslate(el, isHorizontal) {
        const matrix = getComputedStyle(el).transform.replace(/[a-z]|\(|\)|\s/g, '').split(',').map(parseFloat);
        let arr = [];
        if (matrix.length === 16) {
            arr = matrix.slice(12, 14);
        }
        else if (matrix.length === 6) {
            arr = matrix.slice(4, 6);
        }
        return arr[isHorizontal ? 0 : 1] || 0;
    }
    //# sourceMappingURL=dom.js.map

    // Only support single finger touch event.
    function Sensor(element, env, engine, options) {
        const formEls = [
            'INPUT',
            'SELECT',
            'OPTION',
            'TEXTAREA',
            'BUTTON',
            'VIDEO'
        ];
        const { $el, $wrapper } = element;
        const { preheat, move, stop } = engine;
        const { touchable } = env;
        function getPostion(e) {
            const touch = touchable ? e.changedTouches[0] : e;
            return {
                x: touch.pageX,
                y: touch.pageY
            };
        }
        function onTouchStart(e) {
            const shouldPreventDefault = (options.touchStartPreventDefault && formEls.indexOf(e.target.nodeName) === -1)
                || options.touchStartForcePreventDefault;
            if (shouldPreventDefault && !options.passiveListeners)
                e.preventDefault();
            preheat(getPostion(e), getTranslate($wrapper, options.isHorizontal));
        }
        function onTouchMove(e) {
            if (options.touchMoveStopPropagation)
                e.stopPropagation();
            move(getPostion(e), status => (status.isTouching && e.preventDefault()));
        }
        function onTouchEnd(e) {
            onTouchMove(e);
            stop();
        }
        function attach() {
            if (touchable) {
                attachListener($el, 'touchstart', onTouchStart, {
                    passive: options.passiveListeners,
                    capture: false
                });
                attachListener($el, 'touchmove', onTouchMove);
                attachListener($el, 'touchend', onTouchEnd);
                attachListener($el, 'touchcancel', onTouchEnd);
            }
            else {
                attachListener($el, 'mousedown', onTouchStart);
                attachListener(document, 'mousemove', onTouchMove);
                attachListener(document, 'mouseup', onTouchEnd);
            }
        }
        function detach() {
            detachListener($el, 'touchstart', onTouchStart);
            detachListener($el, 'touchmove', onTouchMove);
            detachListener($el, 'touchend', onTouchEnd);
            detachListener($el, 'touchcancel', onTouchEnd);
            detachListener($el, 'mousedown', onTouchStart);
            detachListener(document, 'mousemove', onTouchMove);
            detachListener(document, 'mouseup', onTouchEnd);
        }
        return {
            attach,
            detach
        };
    }
    //# sourceMappingURL=index.js.map

    function Env() {
        return {
            touchable: Boolean('ontouchstart' in window
                || navigator.maxTouchPoints > 0
                || navigator.msMaxTouchPoints > 0
                || window.DocumentTouch && document instanceof DocumentTouch)
        };
    }
    //# sourceMappingURL=index.js.map

    function Limitation(element, measure, options) {
        const { $list } = element;
        const { viewSize, slideSize, boxSize } = measure;
        const base = options.centeredSlides ? (slideSize - viewSize) / 2 : 0;
        // [min, max] usually equal to [-x, 0]
        const max = base;
        const min = options.spaceBetween + viewSize + base - boxSize * $list.length;
        const minIndex = 0;
        const maxIndex = $list.length - (options.centeredSlides ? 1 : Math.ceil(options.slidesPerView));
        return {
            max,
            min,
            base,
            minIndex,
            maxIndex
        };
    }
    //# sourceMappingURL=limitation.js.map

    function Measure(options, element) {
        const { $el } = element;
        const viewSize = options.isHorizontal ? $el.offsetWidth : $el.offsetHeight;
        const slideSize = (viewSize - (Math.ceil(options.slidesPerView - 1)) * options.spaceBetween) / options.slidesPerView;
        const boxSize = slideSize + options.spaceBetween;
        return {
            boxSize,
            viewSize,
            slideSize
        };
    }
    //# sourceMappingURL=index.js.map

    function Renderer(element, options) {
        const { $list, $wrapper } = element;
        function render({ index, layout, status, duration }, cb) {
            const wrapperStyle = {
                transition: status.isStart ? 'none' : `transform ease ${duration === void 0 ? options.speed : duration}ms`,
                transform: options.isHorizontal
                    ? `translate3d(${layout.transform}px, 0, 0)`
                    : `translate3d(0, ${layout.transform}px, 0)`
            };
            const $current = $list[index];
            const $prev = $list[index - 1];
            const $next = $list[index + 1];
            updateStyle($wrapper, wrapperStyle);
            if (!status.isStart) {
                $list.forEach(($slide, i) => {
                    removeClass($slide, [
                        options.slidePrevClass,
                        options.slideNextClass,
                        options.slideActiveClass
                    ]);
                    if (i === index) {
                        addClass($current, options.slideActiveClass);
                    }
                    if (i === index - 1) {
                        addClass($prev, options.slidePrevClass);
                    }
                    if (i === index + 1) {
                        addClass($next, options.slideNextClass);
                    }
                });
            }
        }
        function init() {
            const wrapperStyle = {
                display: 'flex',
                willChange: 'transform',
                flexDirection: options.isHorizontal ? 'row' : 'column'
            };
            const itemStyle = {
                [options.isHorizontal ? 'margin-right' : 'margin-bottom']: `${options.spaceBetween}px`
            };
            updateStyle($wrapper, wrapperStyle);
            $list.forEach($slide => updateStyle($slide, itemStyle));
        }
        return {
            init,
            render
        };
    }

    function Swiper(el, userOptions) {
        const options = optionFormatter(userOptions);
        const eventHub = EventHub();
        const env = Env();
        let element;
        let measure;
        let limitation;
        let renderer;
        let engine;
        let sensor;
        function load() {
            element = Element(el, options);
            measure = Measure(options, element);
            limitation = Limitation(element, measure, options);
            renderer = Renderer(element, options);
            engine = Engine(limitation, options, measure, renderer);
            sensor = Sensor(element, env, engine, options);
            renderer.init();
            sensor.attach();
        }
        function destory() {
            sensor.detach();
            eventHub.clear();
        }
        function update() {
            sensor.detach();
            load();
        }
        function on(evtName, cb) {
            eventHub.on(evtName, cb);
        }
        function off(evtName, cb) {
            eventHub.off(evtName, cb);
        }
        load();
        return {
            on,
            off,
            update,
            destory
        };
    }
    //# sourceMappingURL=index.js.map

    return Swiper;

})));
//# sourceMappingURL=index.js.map
