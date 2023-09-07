import React, { type PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import { type Theme } from '@mui/material/styles'
import { Player } from '@lottiefiles/react-lottie-player'
import Loading from '~/assets/Loading.json'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  logo: {
    width: 200,
    maxWidth: '100%'
  },
  circularProgress: {
    color: theme.palette.primary.main
  }
}))

const SlashScreen = ({ children }: PropsWithChildren): React.JSX.Element => {
  const styles = useStyles()

  return (
    <Box className={styles.root} width={150}>
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
