/* eslint-disable react/require-default-props */
import React from 'react'
import SVG from 'react-inlinesvg'

import iconEdit from '~/assets/icons/icon-edit.svg'
import iconDelete from '~/assets/icons/icon-delete.svg'
import iconSearch from '~/assets/icons/icon-search.svg'
import iconDoubleArrowDown from '~/assets/icons/icon-double-arrow-down.svg'
import iconSingleArrowDownCircule from '~/assets/icons/icon-single-arrow-circule.svg'
import iconSingleArrowUpCircule from '~/assets/icons/icon-single-arrow-up-circule.svg'
import iconCheckCircule from '~/assets/icons/icon-check-circule.svg'
import iconUpload from '~/assets/icons/icon-upload.svg'

import colors from '~/shared/theme/colors'

const SIZE_ICONS = 20

interface IColor {
  color?: string
}

export const IconEdit = ({ color = colors.primary.main }: IColor) => (
  <SVG src={iconEdit} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconDelete = ({ color = colors.error.main }: IColor) => (
  <SVG src={iconDelete} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconSearch = ({ color = colors.text.quaternary }: IColor) => (
  <SVG src={iconSearch} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconDoubleArrowDown = ({ color = colors.text.quaternary }: IColor) => (
  <SVG src={iconDoubleArrowDown} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconSingleArrowDownCircule = ({ color = colors.text.quaternary }: IColor) => (
  <SVG src={iconSingleArrowDownCircule} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconSingleArrowUpCircule = ({ color = colors.text.quaternary }: IColor) => (
  <SVG src={iconSingleArrowUpCircule} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconCheckCircule = ({ color = colors.text.quaternary }: IColor) => (
  <SVG src={iconCheckCircule} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)

export const IconUpload = ({ color = colors.text.quaternary }: IColor) => (
  <SVG src={iconUpload} width={SIZE_ICONS} height={SIZE_ICONS} fill={color} />
)
