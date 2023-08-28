import { InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'

const InputSufix = ({ ...rest }) => (
  <OutlinedInput
    fullWidth
    size="small"
    {...rest}
    endAdornment={<InputAdornment position="end">{rest?.text || ''}</InputAdornment>}
  />
)

export default InputSufix
