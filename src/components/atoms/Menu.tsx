import React, { type PropsWithChildren } from 'react'
import {
  Menu as ComponentMenu
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { type Theme } from '@mui/material/styles'

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    '& .MuiPaper-root': {
      boxShadow: theme.shadows[8]
    }
  }
}))

interface IProps {
  open: boolean
  anchorEl: null | HTMLElement
  handleCloseMenu: () => void
}

const Menu = ({
  open, anchorEl, handleCloseMenu, children
}: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  return (
    <ComponentMenu
      elevation={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      anchorEl={anchorEl}
      onClose={handleCloseMenu}
      className={styles.menu}
    >
      {children}
    </ComponentMenu>
  )
}

export default Menu
