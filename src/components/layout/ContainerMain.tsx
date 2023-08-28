import React, { PropsWithChildren } from 'react'
import {
  Typography, Box,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Paper from './Paper'

const useStyles = makeStyles(() => ({
  paper: {
    overflowY: 'scroll',
    boxSizing: 'border-box',
    maxHeight: '100%',
    height: '100%',
    position: 'relative',
  },
}))

interface IProps {
  title: string,
  fullCard?: boolean
}

const ContainerMain = ({ title, fullCard, children }: PropsWithChildren<IProps>) => {
  const classes = useStyles()

  return (
    <>
      <Box mb={2} flexGrow={0}>
        <Typography variant="subtitle1" color="text.main">
          {title}
        </Typography>
      </Box>

      {fullCard && (
        <Box overflow="auto" height={1}>
          <Paper className={classes.paper}>
            {children}
          </Paper>
        </Box>
      )}

      {!fullCard && children}
    </>
  )
}

ContainerMain.defaultProps = {
  fullCard: true,
}

export default ContainerMain
