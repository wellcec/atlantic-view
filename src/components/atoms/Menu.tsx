import React, { PropsWithChildren } from 'react'
import {
  Menu as ComponentMenu, Theme,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    '& .MuiPaper-root': {
      boxShadow: theme.shadows[8],
    },
  },
}))

interface IProps {
  open: boolean
  anchorEl: null | HTMLElement
  handleCloseMenu: () => void
}

const Menu = ({
  open, anchorEl, handleCloseMenu, children,
}: PropsWithChildren<IProps>) => {
  const classes = useStyles()

  return (
    <ComponentMenu
      elevation={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      anchorEl={anchorEl}
      onClose={handleCloseMenu}
      className={classes.menu}
    >
      {children}
    </ComponentMenu>
  )
}

export default Menu
