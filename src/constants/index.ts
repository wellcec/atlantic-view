import { type ISampleFilter, type IDefaultTheme, type ISampleProductsFilter } from 'models'

export const DEFAULT_THEME: IDefaultTheme = {
  id: 'default',
  primary: '#4d4cac'
}

export const FOLDER_TEMP = 'temp'
export const FOLDER_IMAGES = 'images'

export const NEW_PRODUCT_KEYS = {
  firstInfo: 'firstInfo',
  images: 'images',
  categories: 'categories',
  variations: 'variations',
  tags: 'tags',
  status: 'status',
  descriptions: 'descriptions'
}

export const DEFAULT_PAGESIZE = 10

export const DEFAULT_CATEGORY_PAGESIZE = 5

export const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

export const emptyProductsFilter: ISampleProductsFilter = {
  term: '',
  asc: true,
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

export const ACCEPTABLE_IMAGES = [
  'image/png',
  'image/jpeg',
  'image/jpg'
]

export default DEFAULT_THEME
