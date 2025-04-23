import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import BaseLayout from '~/layout/BaseLayout'
import Home from '~/pages/Home'
import Users from '~/pages/Users'
import ProductsList from '~/pages/Products/list'
import ProductsCreateUpdate from '~/pages/Products/new'
import Categories from '~/pages/Categories'
import WithLayoutRoute from './WithLayoutRoute'

const SwitchRoutes = (): React.JSX.Element => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" />} />
    <Route path="/home" element={<WithLayoutRoute layout={BaseLayout} component={Home} />} />
    <Route path="/customers" element={<WithLayoutRoute layout={BaseLayout} component={Users} />} />

    {/* Products */}
    <Route path="/products" element={<WithLayoutRoute layout={BaseLayout} component={ProductsList} />} />
    <Route path="/products/create" element={<WithLayoutRoute layout={BaseLayout} component={ProductsCreateUpdate} />} />
    <Route path="/products/update/:productId" element={<WithLayoutRoute layout={BaseLayout} component={ProductsCreateUpdate} />} />

    <Route path="/categories" element={<WithLayoutRoute layout={BaseLayout} component={Categories} />} />
  </Routes>
)

export default SwitchRoutes
