import React from 'react'
import { Typography, Divider as ComponentDivider, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  divider: {
    '&.MuiDivider-root::before': {
      width: 0
    },
    '& span.MuiDivider-wrapper': {
      paddingLeft: 0
    }
  }
}))

interface IProps {
  title: string
  hasControl?: boolean
  Buttons?: React.JSX.Element
}

const Divider = ({ title, hasControl, Buttons }: IProps): React.JSX.Element => {
  const styles = useStyles()

  return (
    <ComponentDivider
      flexItem
      textAlign="left"
      orientation="horizontal"
      className={styles.divider}
      sx={{
        '&.MuiDivider-root::after': {
          width: '98%'
        }
      }}
      style={{ width: hasControl ? '92%' : '98%' }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="body1" fontWeight={600}>
          {title}
        </Typography>

        {Buttons && (Buttons)}
      </Box>
    </ComponentDivider>
  )
}

export default Divider
