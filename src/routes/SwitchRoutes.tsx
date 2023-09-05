import React from 'react'
import { Routes, Route } from 'react-router-dom'

import BaseLayout from '~/layout/BaseLayout'
import Home from '~/pages/Home'
import Users from '~/pages/Users'
import Products from '~/pages/Products'
import Categories from '~/pages/Categories'
import WithLayoutRoute from './WithLayoutRoute'

const SwitchRoutes = () => (
  <Routes>
    <Route path="/" element={<WithLayoutRoute layout={BaseLayout} component={Home} />} />
    <Route path="/home" element={<WithLayoutRoute layout={BaseLayout} component={Home} />} />
    <Route path="/customers" element={<WithLayoutRoute layout={BaseLayout} component={Users} />} />
    <Route path="/products" element={<WithLayoutRoute layout={BaseLayout} component={Products} />} />
    <Route path="/categories" element={<WithLayoutRoute layout={BaseLayout} component={Categories} />} />
  </Routes>
)

export default SwitchRoutes
