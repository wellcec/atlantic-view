import React, { PropsWithChildren } from 'react'
import {
  Box,
} from '@mui/material'

const Paper = ({ children }: PropsWithChildren) => (
  <Box display="flex" height={1} overflow="auto" flexGrow={1}>
    {children}
  </Box>
)

export default Paper
