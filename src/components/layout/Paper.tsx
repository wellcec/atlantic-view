import React, { type PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  Paper as PaperCustomer
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  paper: {
    padding: 24
  },
  fullWidth: {
    width: '100%'
  }
}))

interface IProps {
  className?: string
  fullWidth?: boolean
}

const Paper = ({ children, fullWidth, ...rest }: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  const fullWidthClass = fullWidth ? styles.fullWidth : ''
  const className = rest?.className ?? ''
  delete rest?.className

  return (
    <PaperCustomer className={`${styles.paper} ${className} ${fullWidthClass}`}>
      {children}
    </PaperCustomer>
  )
}

Paper.propTypes = {
  className: PropTypes.string,
  fullWidth: PropTypes.bool
}

Paper.defaultProps = {
  className: '',
  fullWidth: false
}

export default Paper
