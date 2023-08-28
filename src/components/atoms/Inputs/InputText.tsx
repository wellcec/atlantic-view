import React from 'react'
import { TextField } from '@mui/material'

const InputText = ({ ...rest }) => (
  <TextField
    fullWidth
    variant="outlined"
    size="small"
    {...rest}
  />
)

export default InputText
