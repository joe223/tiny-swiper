import { createElementsInstance } from '../utils'
import Swiper from '../../src/core/index'
import { LIFE_CYCLES } from '../../src/core/eventHub'

describe('lifecycle', () => {
    const elementsInstance = createElementsInstance(3, {
        width: 300,
        height: 300
    })
    const swiperInstance = new Swiper(elementsInstance.$el)
    const events: {
        [key: string]: Function
    } = {}
    const lifecyclesList = Object.values(LIFE_CYCLES)

    lifecyclesList.forEach(eventName => {
        // const fn = jest.fn(p => console.log(eventName, p))
        const fn = jest.fn()

        events[eventName] = fn
        swiperInstance.on(eventName, fn)
    })

    swiperInstance.slideTo(swiperInstance.state.index + 1)
    swiperInstance.updateSize()
    swiperInstance.update()
    swiperInstance.destroy()

    test(LIFE_CYCLES.BEFORE_SLIDE, () => {
        expect(events[LIFE_CYCLES.BEFORE_SLIDE]).toBeCalledTimes(3)
    })
})
