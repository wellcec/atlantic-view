import React from 'react'
import { Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  buttontab: {
    maxHeight: 30,
    minHeight: 10
  }
}))

interface IProps {
  selected: boolean
  text: string
  onClick: () => void
}

const ButtonTab = ({ selected, text, onClick }: IProps): React.JSX.Element => {
  const styles = useStyles()

  return (
    <Button
      className={styles.buttontab}
      variant={selected ? 'contained' : 'outlined'}
      color="primary"
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default ButtonTab
