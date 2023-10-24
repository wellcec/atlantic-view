import React from 'react'
import { Box, Fab } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { IconDelete } from '~/constants/icons'

const useStyles = makeStyles(() => ({
  buttonRemove: {
    maxHeight: 46,
    maxWidth: 46,
    zIndex: 'auto',

    '& svg': {
      color: '#fff',
      fill: '#fff'
    }
  }
}))

interface IProps {
  title: string
  onClick: () => void
}

const ButtonRemove = ({ title, onClick }: IProps): React.JSX.Element => {
  const styles = useStyles()

  return (
    <Fab color="error" title={title} className={styles.buttonRemove} onClick={onClick}>
      <Box display="flex" alignItems="center">
        <IconDelete />
      </Box>
    </Fab>
  )
}

export default ButtonRemove
