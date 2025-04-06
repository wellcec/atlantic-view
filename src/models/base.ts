export interface IIBaseResponseType {
  code: number
  message: string
  validations: string[]
}

export interface ISuccessResponse {
  code: number
  message: string
}

export default IIBaseResponseType
