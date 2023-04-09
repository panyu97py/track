'use strict'
import { container, SERVICE_IDENTIFIER, EventCenter } from '../src'
import { ERROR_MSG } from '../src/constants'

describe('EventCenter', () => {
  const eventCenter = container.get<EventCenter>(SERVICE_IDENTIFIER.EVENT_CENTER)

  const EXAMPLE_EVENT_NAME = 'EXAMPLE_EVENT_NAME'

  const params = 'params'

  it('trigger on event', () => {
    const firstFn = jest.fn()

    const secondFn = jest.fn()

    eventCenter.on(EXAMPLE_EVENT_NAME, firstFn)

    eventCenter.on(EXAMPLE_EVENT_NAME, secondFn)

    eventCenter.trigger(EXAMPLE_EVENT_NAME, params)

    expect(firstFn).toHaveBeenCalledWith(params)

    expect(secondFn).toHaveBeenCalledWith(params)
  })

  it('trigger once event ', function () {
    const fn = jest.fn()

    eventCenter.once(EXAMPLE_EVENT_NAME, fn)

    eventCenter.trigger(EXAMPLE_EVENT_NAME, params)

    eventCenter.trigger(EXAMPLE_EVENT_NAME, params)

    expect(fn).toHaveBeenCalledWith(params)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('off all event register', () => {
    const fn = jest.fn()

    eventCenter.on(EXAMPLE_EVENT_NAME, fn)

    eventCenter.off(EXAMPLE_EVENT_NAME)

    expect(() => eventCenter.trigger(EXAMPLE_EVENT_NAME, params)).toThrow(ERROR_MSG.EVENT_NAME_IS_NOR_REGISTER)
  })

  it('off designated listener', () => {
    const designatedFn = jest.fn()

    const otherFn = jest.fn()

    eventCenter.on(EXAMPLE_EVENT_NAME, designatedFn)

    eventCenter.on(EXAMPLE_EVENT_NAME, () => otherFn())

    eventCenter.off(EXAMPLE_EVENT_NAME, designatedFn)

    eventCenter.trigger(EXAMPLE_EVENT_NAME, params)

    expect(designatedFn).not.toHaveBeenCalled()

    expect(otherFn).toHaveBeenCalled()
  })
})
