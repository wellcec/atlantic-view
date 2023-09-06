import React, { type PropsWithChildren } from 'react'

import {
  AccordionDetails,
  AccordionSummary,
  Accordion as ComponentAccordion,
  Box
} from '@mui/material'
import { IconDoubleArrowDown } from '~/constants/icons'
import makeStyles from '@mui/styles/makeStyles'
import Divider from '~/components/atoms/Divider'

const useStyles = makeStyles(() => ({
  accordion: {
    '&.MuiPaper-root::before': {
      content: 'none'
    }
  }
}))

interface IProps {
  open: boolean
  title: string
  hasControl?: boolean
  Control?: React.ReactNode
  onChange: () => void
}

const Accordion = ({
  open, title, onChange, hasControl, Control, children
}: PropsWithChildren<IProps>): React.JSX.Element => {
  const classes = useStyles()

  return (
    <ComponentAccordion
      expanded={open}
      onChange={onChange}
      square
      disableGutters
      className={classes.accordion}
    >
      <AccordionSummary expandIcon={<IconDoubleArrowDown />}>
        <Divider title={title} />

        {hasControl && Control}
      </AccordionSummary>

      <AccordionDetails>
        <Box my={1}>
          {children}
        </Box>
      </AccordionDetails>
    </ComponentAccordion>
  )
}

Accordion.defaultProps = {
  hasControl: false,
  Control: <></>
}

export default Accordion
