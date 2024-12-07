export interface ReferrerInfo {
  referrerEventId?: string
  referrerPagePath?: string
}

export interface CurrentInfo {
  pageReferrerInfo: ReferrerInfo | null
}
