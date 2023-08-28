import React from 'react'
import { Box, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  buttonAdd: {
    paddingLeft: 12,
    paddingRight: 12,
    minWidth: 46,
    maxWidth: 46,
    borderRadius: '50%',
  },
}))

interface IProps {
  title: string
  onClick: () => void
}

const ButtonAdd = ({ title, onClick }: IProps) => {
  const classes = useStyles()

  return (
    <Button variant="contained" color="success" title={title} className={classes.buttonAdd} onClick={onClick}>
      <Box display="flex" alignItems="center">
        <AddIcon />
      </Box>
    </Button>
  )
}

export default ButtonAdd
