import React, { PropsWithChildren, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ArrowIcon from '@mui/icons-material/KeyboardArrowLeftOutlined'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List, ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'

import iconLogo from 'assets/images/logo64.png'
import colors from 'shared/theme/colors'
import { DEFAULT_THEME } from '../constants'
import { MenuItems } from '../constants/menus'

const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  backgroundColor: colors.background.container,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const useStyles = makeStyles(() => ({
  buttonList: {
    paddingLeft: 40,
    paddingTop: 15,
    paddingBottom: 15,
  },
  drawer: {
    '& .MuiPaper-root': {
      border: 'none',
    },
  },
  divider: {
    border: colors.primary.main,
    background: colors.primary.main,
    borderWidth: 10,
    width: 6,
    height: 30,
    borderRadius: 10,
  },
  selected: {
    '& svg': {
      fill: DEFAULT_THEME.primary,
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        fontWeight: 500,
      },
    },
  },
  notSelected: {
    '& svg': {
      fill: colors.text.tertiary,
    },
    '& .MuiListItemText-root': {
      '& .MuiTypography-root': {
        color: colors.text.tertiary,
      },
    },
  },
}))

const BaseLayout = ({ children }: PropsWithChildren) => {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()

  const [openDrawer, setOpenDrawer] = useState<boolean>(true)

  const switchRoute = (path: string): void => navigate(path)

  const isCurrentPath = (paths: string[]): boolean => paths.includes(location.pathname)

  return (
    <Box display="flex" height={1} overflow="auto" style={{ overflowX: 'hidden' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openDrawer}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2.1}>
          <Box display="flex" gap="10px" alignItems="center" ml={8}>
            <img src={iconLogo} alt="Logo" />
          </Box>

          <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
            <ArrowIcon />
          </IconButton>
        </Box>

        <List>
          {MenuItems.map((menuItem, index) => (
            <ListItem
              disablePadding
              key={`${menuItem.title}-${index}`}
              className={`${isCurrentPath(menuItem.paths) ? classes.selected : classes.notSelected}`}
              onClick={() => switchRoute(menuItem.path)}
            >
              <ListItemButton className={classes.buttonList}>
                <ListItemIcon>
                  {menuItem.icon()}
                </ListItemIcon>
                <ListItemText primary={
                  <Typography variant="body1" color="primary" fontWeight={400}>{menuItem.title}</Typography>
                }
                />

                {isCurrentPath(menuItem.paths) && (
                  <Divider orientation="vertical" className={classes.divider} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main open={openDrawer}>
        {children}
      </Main>
    </Box>
  )
}

export default BaseLayout
