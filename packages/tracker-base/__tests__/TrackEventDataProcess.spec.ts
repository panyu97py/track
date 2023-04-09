'use strict'
import { container, SERVICE_IDENTIFIER, TrackEventDataProcess, TrackEventQueueManager, TargetTrackConfig } from '../src'
import { EVENT_TYPE, DEFAULT_EVENT_CONFIG } from '../src/constants'

const defaultExampleEventConfig: Required<TargetTrackConfig> = {
  eventExposureConfig: {
    eventType: EVENT_TYPE.EXPOSURE,
    eventName: 'DEFAULT_EXAMPLE_EXPOSURE',
    relevanceKey: 'exampleId'
  },
  eventClickConfig: {
    eventType: EVENT_TYPE.CLICK,
    eventName: 'DEFAULT_EXAMPLE_CLICK',
    relevanceKey: 'exampleId',
    originEventType: EVENT_TYPE.EXPOSURE,
    originEventName: 'DEFAULT_EXAMPLE_EXPOSURE'
  },
  extendData: {
    exampleId: 'exampleId'
  }
}

describe('trackEventDataProcess', () => {
  const trackEventDataProcess = container.get<TrackEventDataProcess>(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)

  const trackEventQueueManager: TrackEventQueueManager = (trackEventDataProcess as any)._trackEventQueueManager

  const spySubmitEventsQueue = jest.spyOn(trackEventQueueManager, 'submitEvent')

  const { eventExposureConfig, eventClickConfig, extendData } = defaultExampleEventConfig

  describe('generateEventKey', () => {
    it('no extendData', () => {
      const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig)

      expect(eventKey).toEqual(`${eventExposureConfig?.eventType}-${eventExposureConfig?.eventName}`)
    })

    it('exit extendData', () => {
      const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig, extendData)

      expect(eventKey).toEqual(`${eventExposureConfig?.eventType}-${eventExposureConfig?.eventName}-${extendData?.exampleId}`)
    })
  })

  describe('getEventConfig', () => {
    it('exposure event config', () => {
      const eventConfig = trackEventDataProcess.getEventConfig(defaultExampleEventConfig, EVENT_TYPE.EXPOSURE)

      expect(eventConfig).toEqual(defaultExampleEventConfig.eventExposureConfig)
    })

    it('click event config', () => {
      const eventConfig = trackEventDataProcess.getEventConfig(defaultExampleEventConfig, EVENT_TYPE.CLICK)

      expect(eventConfig).toEqual(defaultExampleEventConfig.eventClickConfig)
    })
  })

  describe('generateEventData', () => {
    const eventData = trackEventDataProcess.generateEventData(eventExposureConfig, extendData)

    expect(eventData.eventId).toBeTruthy()

    expect(eventData.eventType).toBe(eventExposureConfig?.eventType)

    expect(eventData.eventName).toBe(eventExposureConfig?.eventName)

    expect(eventData.startTime).toBeTruthy()

    expect(eventData.extendData).toBeTruthy()
  })

  describe('fillReferrerId', () => {
    it('page event referrer', () => {
      trackEventDataProcess.targetBeginExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)

      const pageEventKey = trackEventDataProcess.generateEventKey(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG.eventExposureConfig)

      const referrerPageEventData = (trackEventDataProcess as any)._exposureEventDataMap.get(pageEventKey)

      trackEventDataProcess.targetEndExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)

      const newTrackEventDataProcess = container.get<TrackEventDataProcess>(SERVICE_IDENTIFIER.TRACK_EVENT_DATA_PROCESS)

      newTrackEventDataProcess.targetBeginExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)

      const newPageEventData = (newTrackEventDataProcess as any)._exposureEventDataMap.get(pageEventKey)

      expect(newPageEventData.referrerId).toBeTruthy()

      expect(newPageEventData.referrerId).toBe(referrerPageEventData.eventId)
    })

    it('referrer is page exposure', () => {
      trackEventDataProcess.targetBeginExposure(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG)

      const pageEventKey = trackEventDataProcess.generateEventKey(DEFAULT_EVENT_CONFIG.PAGE_EXPOSURE_CONFIG.eventExposureConfig)

      const exampleEventData = trackEventDataProcess.generateEventData(eventExposureConfig)

      const pageEventData = (trackEventDataProcess as any)._exposureEventDataMap.get(pageEventKey)

      expect(exampleEventData.referrerId).toBeTruthy()

      expect(exampleEventData.referrerId).toBe(pageEventData?.eventId)
    })

    it('referrer is target exposure', () => {
      trackEventDataProcess.targetBeginExposure(defaultExampleEventConfig)

      const targetExposureKey = trackEventDataProcess.generateEventKey(eventExposureConfig, extendData)

      const targetExposureData = (trackEventDataProcess as any)._exposureEventDataMap.get(targetExposureKey)

      const exampleEventData = trackEventDataProcess.generateEventData(eventClickConfig, extendData)

      expect(exampleEventData.referrerId).toBeTruthy()

      expect(exampleEventData.referrerId).toBe(targetExposureData?.eventId)
    })

    it('referrer is target click', () => {
      const testEventConfig: Omit<Required<TargetTrackConfig>, 'eventClickConfig'> = {
        eventExposureConfig: {
          eventType: EVENT_TYPE.EXPOSURE,
          eventName: 'TEST_EXPOSURE',
          originEventType: EVENT_TYPE.CLICK,
          originEventName: defaultExampleEventConfig.eventClickConfig.eventName,
          relevanceKey: defaultExampleEventConfig.eventClickConfig.relevanceKey
        },
        extendData: defaultExampleEventConfig.extendData
      }

      trackEventDataProcess.targetClick(defaultExampleEventConfig)

      const targetClickKey = trackEventDataProcess.generateEventKey(eventClickConfig, extendData)

      const targetClickData = (trackEventDataProcess as any)._clickEventDataMap.get(targetClickKey)

      const testEventData = trackEventDataProcess.generateEventData(testEventConfig.eventExposureConfig, testEventConfig.extendData)

      expect(testEventData.referrerId).toBeTruthy()

      expect(testEventData.referrerId).toBe(targetClickData?.eventId)
    })
  })

  describe('fillEndTime', () => {
    it('fill click event end time', () => {
      const simpleEventData = trackEventDataProcess.generateEventData(eventClickConfig)

      const eventData = trackEventDataProcess.fillEndTime(simpleEventData, EVENT_TYPE.CLICK)

      expect(eventData.duration).toBe(0)

      expect(eventData.startTime).toBe(eventData.endTime)
    })

    it('fill exposure event end time', () => {
      const simpleEventData = trackEventDataProcess.generateEventData(eventExposureConfig)

      const eventData = trackEventDataProcess.fillEndTime(simpleEventData, EVENT_TYPE.EXPOSURE)

      expect(eventData.duration).toBe(eventData.endTime - eventData.startTime)
    })
  })

  describe('targetBeginExposure', () => {
    trackEventDataProcess.targetBeginExposure(defaultExampleEventConfig)

    const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig, extendData)

    expect((trackEventDataProcess as any)._exposureEventDataMap.get(eventKey)).toBeTruthy()
  })

  describe('targetEndExposure', () => {
    it('', async () => {
      trackEventDataProcess.targetBeginExposure(defaultExampleEventConfig)

      await new Promise<void>(resolve => setTimeout(() => {
        trackEventDataProcess.targetEndExposure(defaultExampleEventConfig)
        resolve()
      }, 500))

      const eventKey = trackEventDataProcess.generateEventKey(eventExposureConfig, extendData)

      expect(spySubmitEventsQueue).toHaveBeenCalled()

      expect((trackEventDataProcess as any)._exposureEventDataMap.get(eventKey)).toBeUndefined()
    })
  })

  describe('targetClick', () => {
    it('target click track', () => {
      trackEventDataProcess.targetClick(defaultExampleEventConfig)

      const eventKey = trackEventDataProcess.generateEventKey(eventClickConfig, extendData)

      expect(spySubmitEventsQueue).toHaveBeenCalled()

      expect((trackEventDataProcess as any)._clickEventDataMap.get(eventKey)).toBeTruthy()
    })
  })
})
