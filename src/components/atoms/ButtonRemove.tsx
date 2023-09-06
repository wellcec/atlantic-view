import React from 'react'
import { Box, Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { IconDelete } from '~/constants/icons'

const useStyles = makeStyles(() => ({
  buttonAdd: {
    paddingLeft: 12,
    paddingRight: 12,
    minWidth: 46,
    maxWidth: 46,
    borderRadius: '50%'
  }
}))

interface IProps {
  title: string
  onClick: () => void
}

const ButtonRemove = ({ title, onClick }: IProps): React.JSX.Element => {
  const classes = useStyles()

  return (
    <Button variant="contained" color="error" title={title} className={classes.buttonAdd} onClick={onClick}>
      <Box display="flex" alignItems="center">
        <IconDelete color="#fff" />
      </Box>
    </Button>
  )
}

export default ButtonRemove
