import { NotifyClientTypes } from '@walletconnect/notify-client'

export interface InfiniteScrollNotificationState {
  fullNotifications: NotifyClientTypes.NotifyMessage[]
  existingIds: Set<string>
}

export type InfiniteScrollActions =
  | { type: 'add_to_set'; vals: string[] }
  | { type: 'concat_to_array'; vals: NotifyClientTypes.NotifyMessage[] }

export const infiniteScrollReducer = (
  state: InfiniteScrollNotificationState,
  action: InfiniteScrollActions
): InfiniteScrollNotificationState => {
  switch (action.type) {
    case 'concat_to_array':
      const filteredVals = action.vals.filter(val => !state.existingIds.has(val.id))
      return {
        ...state,
        fullNotifications: state.fullNotifications.concat(filteredVals)
      }
    case 'add_to_set':
      const newFullIdsSet = new Set(state.existingIds)
      for (const val of action.vals) {
        newFullIdsSet.add(val)
      }
      return {
        ...state,
        existingIds: newFullIdsSet
      }
  }
}
