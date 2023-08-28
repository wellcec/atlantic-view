import { Box, Typography } from '@mui/material'
import React from 'react'

interface IProps {
  text: string
}

const EmptyDataText = ({ text }: IProps) => (
  <Box width={1} textAlign="center">
    <Typography variant="body2" color="primary">
      <i>{text}</i>
    </Typography>
  </Box>
)

export default EmptyDataText
