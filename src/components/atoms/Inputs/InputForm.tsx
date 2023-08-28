import React, { PropsWithChildren } from 'react'
import {
  Box, FormControl, FormLabel, FormHelperText,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import colors from 'shared/theme/colors'

const useStyles = makeStyles(() => ({
  color: {
    color: colors.text.main,
    paddingRight: 12,
    minWidth: 40,
    borderRadius: '50%',
  },
}))

interface IProps {
  title: string,
  fullWidth: boolean
  helperText?: boolean
  formik?: any
  propField?: string
}

const InputForm = ({
  title, fullWidth, formik, helperText, propField, children,
}: PropsWithChildren<IProps>) => {
  const classes = useStyles()

  return (
    <>
      <FormControl fullWidth={fullWidth}>
        <Box mb={1}>
          <FormLabel className={classes.color}>{title}</FormLabel>
        </Box>

        {children}

        {helperText && (
          <FormHelperText
            hidden={!formik.touched[propField] || !formik.errors[propField]}
            error={formik.touched[propField] && !!formik.errors[propField]}
          >
            {formik.errors[propField]}
          </FormHelperText>
        )}
      </FormControl>
    </>
  )
}

InputForm.defaultProps = {
  helperText: false,
  formik: null,
  propField: '',
}

export default InputForm
