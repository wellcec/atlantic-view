import React, { type PropsWithChildren, useEffect, useRef } from 'react'
import {
  Box, Modal as ComponentModal, IconButton, Paper, type Theme, Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing(1),
    height: `calc(100% - ${theme.spacing(2)})`
  },
  paper: {
    maxWidth: '90%',
    maxHeight: '100%',
    position: 'relative',
    paddingTop: theme.spacing(5),
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      width: '96%'
    },

    '& .MuiPaper-root': {
      maxWidth: '100% !important',
      maxHeight: '100%',
      height: '100%',
      borderRadius: 0
    }
  },
  close: {
    cursor: 'pointer',
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2)
  },
  titulo: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2)
  }
}))

interface IProps {
  open: boolean
  title?: string
  handleClose: () => void
}

const Modal = ({
  open, title, handleClose, children
}: PropsWithChildren<IProps>): React.JSX.Element => {
  const styles = useStyles()

  const ref = useRef(null)

  const handleClickOutside = (event: MouseEvent): void => {
    // @ts-expect-error
    const idmodal = event.target?.id ?? ''

    if (idmodal === 'default-modal-component') {
      handleClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <ComponentModal
      ref={ref}
      open={open}
      onClose={handleClose}
    >
      <Box className={styles.modal} id="default-modal-component">
        <Paper className={styles.paper}>
          {title && (
            <Typography variant="subtitle1" color="text.main" className={styles.titulo}>
              {title}
            </Typography>
          )}

          <IconButton
            title="Fechar"
            className={styles.close}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>

          <Box mt={3}>
            {children}
          </Box>
        </Paper>
      </Box>
    </ComponentModal>
  )
}

Modal.defaultProps = {
  title: undefined
}

export default Modal
