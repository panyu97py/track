import { useMemo } from 'react'
import { Current } from '../constants'

export const usePageReferrerInfo = () => {
  return useMemo(() => Current.pageReferrerInfo || {}, [])
}
