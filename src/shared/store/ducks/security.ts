/* eslint-disable indent */
import { useCallback } from 'react'
import { produce } from 'immer'
import { useDispatch } from 'react-redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const INITIAL_STATE = {
  user: {},
  credential: '',
}

export const Types = {
  USER: 'security/USER',
  CREDENTIAL: 'security/CREDENTIAL',
}

type ActionType = {
  type: string,
  payload: any
}

const reducer = (state = INITIAL_STATE, action: ActionType) => {
  switch (action.type) {
    case Types.USER: {
      const { user } = action.payload

      return produce(state, (draft) => {
        draft.user = user
      })
    }

    case Types.CREDENTIAL: {
      const { credential } = action.payload

      return produce(state, (draft) => {
        draft.credential = credential
      })
    }

    default: {
      return state
    }
  }
}

export const useSecurityAction = () => {
  const dispatch = useDispatch()
  const setUser = useCallback(
    (user: any) => dispatch({
      type: Types.USER,
      payload: { user },
    }),
    [dispatch],
  )

  const setCredential = useCallback(
    (credential: string) => dispatch({
      type: Types.CREDENTIAL,
      payload: { credential },
    }),
    [dispatch],
  )

  const cleanUser = useCallback(
    () => dispatch({
      type: Types.USER,
      payload: { user: {} },
    }),
    [dispatch],
  )

  const cleanCredential = useCallback(
    () => dispatch({
      type: Types.CREDENTIAL,
      payload: { credential: '' },
    }),
    [dispatch],
  )

  return {
    setUser,
    setCredential,
    cleanUser,
    cleanCredential,
  }
}

export default persistReducer(
  {
    key: 'security',
    storage,
  },
  reducer,
)
