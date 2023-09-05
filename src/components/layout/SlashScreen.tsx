import React, { PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import { Theme } from '@mui/material/styles'
import { Player } from '@lottiefiles/react-lottie-player'
import Loading from '~/assets/Loading.json'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  logo: {
    width: 200,
    maxWidth: '100%',
  },
  circularProgress: {
    color: theme.palette.primary.main,
  },
}))

const SlashScreen = ({ children }: PropsWithChildren) => {
  const classes = useStyles()

  return (
    <Box className={classes.root} width={150}>
      {/* <CircularProgress className={classes.circularProgress} /> */}

      <Player
        src={Loading}
        className="player"
        loop
        autoplay
      />
      {children}
    </Box>
  )
}

export default SlashScreen
