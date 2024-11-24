import { EventData } from './types'

type OutputEventData = (eventData: EventData) => void

export class Tracker {
  private static tracker: Tracker

  private outputEventData: OutputEventData

  public static getInstance () {
    if (!this.tracker) {
      this.tracker = new Tracker()
    }
    return this.tracker
  }

  public targetClick () {
  }

  public targetBeginExposure () {
  }

  public targetEndExposure () {
  }

  public registerCallback (callback: OutputEventData) {
    this.outputEventData = callback
  }
}
