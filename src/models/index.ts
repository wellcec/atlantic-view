/* eslint-disable no-unused-vars */

export interface IDefaultTheme {
  id: string,
  primary: string
}

export interface IMenuItem {
  title: string,
  path: string,
  icon: any,
  paths: string[]
}

export interface ISuccessResponse {
  message: string
}

export interface ISampleFilter {
  term: string,
  page: number,
  pageSize: number
}

export type AlertType = {
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
}

export interface IAlerts {
  alert: AlertType,
  setAlert: (alert: AlertType) => void
}
