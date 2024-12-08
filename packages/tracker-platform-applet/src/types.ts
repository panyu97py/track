import { EventConfig } from '@trackerjs/core'

export interface ReferrerInfo {
  referrerEventId?: string
  referrerPagePath?: string
}

export interface CurrentInfo {
  pageReferrerInfo: ReferrerInfo | null
}

export interface AppleTrackTargetConfig extends EventConfig {
  selfSelector?: string
}

export interface DomInfo {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface TrackTargetDomInfo extends DomInfo {
  dataset: { trackKey: string }
}
