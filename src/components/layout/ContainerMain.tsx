import React, { type PropsWithChildren } from 'react'
import {
  Typography, Box
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Paper from './Paper'

const useStyles = makeStyles(() => ({
  paper: {
    overflowY: 'scroll',
    boxSizing: 'border-box',
    maxHeight: '100%',
    height: '100%',
    position: 'relative'
  }
}))

interface IProps {
  title: string
  fullCard?: boolean
  icon?: React.JSX.Element
}

const ContainerMain = ({ title, fullCard, icon, children }: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  return (
    <>
      <Box display="flex" gap={2} alignItems="center" mb={2} flexGrow={0}>
        {icon && (
          <Box>
            {icon}
          </Box>
        )}

        <Typography variant="subtitle1" color="text.main">
          {title}
        </Typography>
      </Box>

      {fullCard && (
        <Box overflow="auto" height={1}>
          <Paper className={styles.paper}>
            {children}
          </Paper>
        </Box>
      )}

      {!fullCard && children}
    </>
  )
}

ContainerMain.defaultProps = {
  fullCard: true
}

export default ContainerMain
