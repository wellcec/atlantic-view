import React from 'react'
import { Box, Typography } from '@mui/material'

interface IProps {
  text: string
}

const EmptyDataText = ({ text }: IProps): React.JSX.Element => (
  <Box width={1} textAlign="center">
    <Typography
      variant="body2"
      color="primary"
      dangerouslySetInnerHTML={{ __html: `<i>${text}</i>` }}
    />
  </Box>
)

export default EmptyDataText
