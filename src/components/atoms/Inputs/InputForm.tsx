import React, { type PropsWithChildren } from 'react'
import {
  Box, FormControl, FormLabel, FormHelperText
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import colors from '~/shared/theme/colors'

const useStyles = makeStyles(() => ({
  color: {
    color: colors.text.main,
    paddingRight: 12,
    minWidth: 40,
    borderRadius: '50%'
  }
}))

interface IProps {
  title: string
  fullWidth: boolean
  helperText?: boolean
  formik?: any
  propField?: string
}

const InputForm = ({
  title, fullWidth, formik, helperText, propField, children
}: PropsWithChildren<IProps>): React.JSX.Element => {
  const classes = useStyles()
  const field = propField ?? ''

  return (
    <>
      <FormControl fullWidth={fullWidth}>
        <Box mb={1}>
          <FormLabel className={classes.color}>{title}</FormLabel>
        </Box>

        {children}

        {helperText && (
          <FormHelperText
            hidden={!formik.touched[field] || !formik.errors[field]}
            error={formik.touched[field] && !!formik.errors[field]}
          >
            {formik.errors[field]}
          </FormHelperText>
        )}
      </FormControl>
    </>
  )
}

InputForm.defaultProps = {
  helperText: false,
  formik: null,
  propField: ''
}

export default InputForm
