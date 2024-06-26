/* eslint-disable no-unused-vars */

export interface IDefaultTheme {
  id: string
  primary: string
}

export interface IMenuItem {
  title: string
  path: string
  icon: any
  paths: string[]
}

export interface ISuccessResponse {
  message: string
}

export interface INoLoading {
  noLoading: boolean
}

export interface ISampleFilter {
  term: string
  page: number
  pageSize: number
}

type MsgAlertType = 'success' | 'error' | 'warning' | 'info'

export const ALERT_TYPES = {
  success: 'success' as MsgAlertType,
  error: 'error' as MsgAlertType,
  warning: 'warning' as MsgAlertType,
  info: 'info' as MsgAlertType
}

export interface AlertType {
  type: MsgAlertType
  message: string
}

export interface IAlerts {
  alert: AlertType
  setAlert: (alert: AlertType) => void
}

export type ActionsType = 'create' | 'update'

export const ACTIONS = {
  create: 'create' as ActionsType,
  update: 'update' as ActionsType
}
