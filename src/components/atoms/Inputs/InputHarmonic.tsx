import { TextField } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'

const useStyles = makeStyles(() => ({
  input: {
    '& .MuiInputBase-root': {
      borderRadius: '20px',
    },
  },
}))

const InputHarmonic = ({ ...rest }) => {
  const classes = useStyles()

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      className={classes.input}
      {...rest}
    />
  )
}

export default InputHarmonic
