import React from 'react'
import {
  Box, Typography
} from '@mui/material'
import Container from '~/components/layout/ContainerMain'
import BoxContainer from '~/components/layout/BoxHeightContainer'

const Home = (): React.JSX.Element => (
  <>
    <Container title="Dashboard">
      <BoxContainer>
        <Box pb={2}>
          <Typography color="primary">
            Dashboard
          </Typography>
        </Box>
      </BoxContainer>
    </Container>
  </>
)

export default Home
