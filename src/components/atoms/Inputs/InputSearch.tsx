import React from 'react'
import {
  FormControl, IconButton, InputAdornment, OutlinedInput,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import { IconSearch } from 'constants/icons'

const useStyles = makeStyles(() => ({
  inputSearch: {
    borderRadius: 30,
    paddingLeft: 23,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e7e5e5d9',
    },
  },
}))

interface IProps {
  placeholder: string
  // eslint-disable-next-line no-unused-vars
  onChange: (event: any) => void
}

const InputSearch = ({ placeholder, onChange }: IProps) => {
  const classes = useStyles()

  return (
    <FormControl variant="outlined" fullWidth>
      <OutlinedInput
        className={classes.inputSearch}
        fullWidth
        placeholder={placeholder}
        color="secondary"
        onChange={onChange}
        startAdornment={(
          <InputAdornment position="start">
            <IconButton edge="start">
              <IconSearch />
            </IconButton>
          </InputAdornment>
        )}
      />
    </FormControl>
  )
}

export default InputSearch
