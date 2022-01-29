import { debounce } from '../../src/core/render/timing'
import {wait} from '../utils'

describe('Timing', () => {
    it('debounce', async () => {
        const cb = jest.fn()
        const fn = debounce(cb, 200, {
            trailing: false
        })

        fn()
        fn()

        await wait(200)

        fn()

        expect(cb.mock.calls.length).toEqual(2)
    })

    it('trailing debounce', async () => {
        const cb = jest.fn()
        const fn = debounce(cb, 200, {
            trailing: true
        })

        fn()
        fn()

        await wait(200)

        fn()

        expect(cb.mock.calls.length).toEqual(3)
    })
})
