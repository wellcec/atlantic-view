import React from 'react'
import SVG from 'react-inlinesvg'

import iconEdit from '~/assets/icons/icon-edit.svg'
import iconAdd from '~/assets/icons/icon-add.svg'
import iconDelete from '~/assets/icons/icon-delete.svg'
import iconSearch from '~/assets/icons/icon-search.svg'
import iconDoubleArrowDown from '~/assets/icons/icon-double-arrow-down.svg'
import iconSingleArrowDownCircule from '~/assets/icons/icon-single-arrow-circule.svg'
import iconSingleArrowUpCircule from '~/assets/icons/icon-single-arrow-up-circule.svg'
import iconSingleArrowLeftCircule from '~/assets/icons/icon-single-arrow-left-circule.svg'
import iconCheckCircule from '~/assets/icons/icon-check-circule.svg'
import iconMenuHamburguer from '~/assets/icons/icon-menu-hambuguer.svg'
import iconUpload from '~/assets/icons/icon-upload.svg'
import iconProducts from '~/assets/icons/icon-products.svg'

import colors from '~/shared/theme/colors'

const SIZE_ICONS = 23

interface IColor {
  color?: string
  size?: number
}

export const IconAdd = ({ color = colors.error.main, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconAdd} width={size} height={size} fill={color} />
)

export const IconEdit = ({ color = colors.primary.main, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconEdit} width={size} height={size} fill={color} />
)

export const IconDelete = ({ color = colors.error.main, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconDelete} width={size} height={size} fill={color} />
)

export const IconSearch = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSearch} width={size} height={size} fill={color} />
)

export const IconDoubleArrowDown = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconDoubleArrowDown} width={size} height={size} fill={color} />
)

export const IconSingleArrowDownCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowDownCircule} width={size} height={size} fill={color} />
)

export const IconSingleArrowUpCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowUpCircule} width={size} height={size} fill={color} />
)

export const IconSingleArrowLeftCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconSingleArrowLeftCircule} width={size} height={size} fill={color} />
)

export const IconCheckCircule = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconCheckCircule} width={size} height={size} fill={color} />
)

export const IconUpload = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconUpload} width={size} height={size} fill={color} />
)

export const IconMenuHamburguer = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconMenuHamburguer} width={size} height={size} fill={color} />
)

export const IconProducts = ({ color = colors.text.quaternary, size = SIZE_ICONS }: IColor): React.JSX.Element => (
  <SVG src={iconProducts} width={size} height={size} fill={color} />
)
