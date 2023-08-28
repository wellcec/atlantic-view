import React, { useEffect, useMemo, useState } from 'react'
import EventEmitter from 'events'

import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'

import SlashScreen from './SlashScreen'

const useStyles = makeStyles(() => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 2000,
    background: '#ffffff7d',
  },
}))

const emitter = new EventEmitter()

const LOADER_SHOW = 'loader.show'
const LOADER_HIDE = 'loader.hide'
const LOADER_ENABLE = 'loader.enable'
const LOADER_DISABLE = 'loader.disable'

interface IProps {
  show: boolean,
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void
}

const Loader = ({ show, setLoading }: IProps) => {
  const classes = useStyles()
  const [disabled, setDisabled] = useState<number>(0)
  const [showByEvent, setShowByEvent] = useState<boolean>(false)
  const [message, setMessage] = useState<JSX.Element>(<SlashScreen><></></SlashScreen>)

  const textMessage = useMemo(() => (
    <Box fontSize={15} mt={1.2} p={3} borderRadius={2.6} bgcolor="#fff">
      Aguarde mais um pouquinho,
      <br />
      estamos carregando...
    </Box>
  ), [])

  useEffect(() => {
    const showLoader = () => {
      setShowByEvent(true)
    }

    emitter.on(LOADER_SHOW, showLoader)

    const hideLoader = () => setShowByEvent(false)
    emitter.on(LOADER_HIDE, hideLoader)

    const enableLoader = () => {
      setLoading(false)
      setDisabled((count) => (count > 0 ? count - 1 : 0))
    }

    emitter.on(LOADER_ENABLE, enableLoader)

    const disableLoader = () => setDisabled((count) => ++count)
    emitter.on(LOADER_DISABLE, disableLoader)

    return () => {
      emitter.removeListener(LOADER_SHOW, showLoader)
      emitter.removeListener(LOADER_HIDE, hideLoader)
      emitter.removeListener(LOADER_ENABLE, enableLoader)
      emitter.removeListener(LOADER_DISABLE, disableLoader)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (disabled === 0 && (show || showByEvent)) {
      setMessage(<SlashScreen><></></SlashScreen>)
    }
  }, [disabled, show, showByEvent, textMessage])

  return (disabled === 0 && (show || showByEvent) && (
    <Box className={classes.root}>
      <Box p={1}>
        <Typography align="center" variant="h6" color="primary">
          {message}
        </Typography>
      </Box>
    </Box>
  ))
}

export default Loader
