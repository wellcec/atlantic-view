import React from 'react'
import {
  Box, Button, Typography, Grid, Card, CardContent
} from '@mui/material'
import Container from '~/components/layout/ContainerMain'
import useUtils from '~/shared/hooks/useUtils'

const Home = (): React.JSX.Element => {
  const { downloadPDF } = useUtils()

  const cards = [
    { title: 'Total Users', value: '1,234' },
    { title: 'Revenue', value: '$12,345' },
    { title: 'Active Sessions', value: '56' },
    { title: 'Pending Orders', value: '23' },
  ]

  return (
    <>
      <Container title="Dashboard" fullCard={false}>
        <Box mb={4}>
          <Grid container spacing={3}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mb={2} flexGrow={0}>
          <Typography color="primary">
            Dashboard
          </Typography>
        </Box>

        <Box>
          <Button variant="contained" onClick={downloadPDF}>
            Download test
          </Button>
        </Box>
      </Container>
    </>
  )
}

export default Home
