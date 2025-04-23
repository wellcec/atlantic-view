import { Box, Typography } from '@mui/material'
import React from 'react'

interface IProps {
  title: string
  subtitle: string
}

const TitleInformation = ({ title, subtitle }: IProps): React.JSX.Element => {
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" fontWeight={400} color="primary">
        {title}
      </Typography>

      <Typography variant="body2" fontWeight={400} color="primary">
        {subtitle}
      </Typography>
    </Box>
  )
}

export default TitleInformation
