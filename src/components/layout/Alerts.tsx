import React, { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { isEmpty } from 'lodash'

import { useAlerts } from '~/shared/alerts/AlertContext'

const Alerts = () => {
  const [open, setOpen] = useState<boolean>(false)
  const { alert, setAlert } = useAlerts()

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
    setAlert({ type: 'info', message: '' })
  }

  useEffect(() => {
    if (!isEmpty(alert.message)) {
      setOpen(true)
    }
  }, [alert])

  return (
    <>
      {open && (
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar
            open={open}
            onClose={handleClose}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleClose} severity={alert.type} sx={{ width: '100%' }} variant="filled">
              <Typography variant="body1">
                {alert.message}
              </Typography>
            </Alert>
          </Snackbar>
        </Stack>
      )}
    </>

  )
}

export default Alerts
