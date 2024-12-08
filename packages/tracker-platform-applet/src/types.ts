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
