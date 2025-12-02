import React from 'react'
import SVG from 'react-inlinesvg'

import iconDashboard from '~/assets/icons/icon-dashboard.svg'
import iconCustomers from '~/assets/icons/icon-customers.svg'
import iconProducts from '~/assets/icons/icon-products.svg'
import iconCategories from '~/assets/icons/icon-categories.svg'
import { type IMenuItem } from '~/models'

export const SIZE_ICONS_HOME = 20

export const MenuItems: IMenuItem[] = [
  {
    type: 'common',
    title: 'Home',
    path: '/home',
    paths: ['/home'],
    icon: () => (
      <SVG
        src={iconDashboard}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  },
  {
    type: 'common',
    title: 'Clientes',
    path: '/customers',
    paths: ['/customers'],
    icon: () => (
      <SVG
        src={iconCustomers}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  },
  {
    type: 'collapse',
    title: 'Catálogo',
    path: '/products',
    paths: ['/products', '/products/create', '/products/update'],
    icon: () => (
      <SVG
        src={iconProducts}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    ),
    menus: [
      {
        title: 'Produtos',
        path: '/products',
        icon: () => (
          <SVG
            src={iconProducts}
            width={SIZE_ICONS_HOME}
            height={SIZE_ICONS_HOME}
          />
        )
      },
      {
        title: 'Serviços',
        path: '/services',
        icon: () => (
          <SVG
            src={iconProducts}
            width={SIZE_ICONS_HOME}
            height={SIZE_ICONS_HOME}
          />
        )
      }
    ]
  },
  {
    type: 'common',
    title: 'Categorias',
    path: '/categories',
    paths: ['/categories'],
    icon: () => (
      <SVG
        src={iconCategories}
        width={SIZE_ICONS_HOME}
        height={SIZE_ICONS_HOME}
      />
    )
  }
]
