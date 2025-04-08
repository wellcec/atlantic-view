import React from 'react'
import { Box } from '@mui/material'
import { IconCheckCircule, IconDelete } from '~/constants/icons'
import colors from '~/shared/theme/colors'

interface IProps {
  active: boolean
}

const CheckTypeVariationAdded = ({ active }: IProps): React.JSX.Element => {
  return (
    <Box display="flex" alignItems="center">
      {active ? <IconCheckCircule color={colors.success.main} /> : <IconDelete />}
    </Box>
  )
}

export default CheckTypeVariationAdded
