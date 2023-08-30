import React, { useEffect, useState } from 'react'
import {
  Box, Grid, IconButton, Typography,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import colors from 'shared/theme/colors'
import Container from 'components/layout/ContainerMain'
import useUsersService from 'services/useUsersService'
import { UserType, GetAllUsersType } from 'models/users'
import Paper from 'components/layout/Paper'

const useStyles = makeStyles(() => ({
  item: {
    borderBottom: `1px solid ${colors.text.light}`,
  },
  paperList: {
    width: '100%',
    overflow: 'auto',
  },
}))

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([])

  const classes = useStyles()
  const { getUsers } = useUsersService()

  useEffect(() => {
    getUsers().then(
      (response: GetAllUsersType) => {
        const { data = [] } = response.data ?? {}

        setUsers(data)
      },
      () => {
        // alert(error)
      },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container title="Clientes" fullCard={false}>
        <Box mb={2} flexGrow={0}>
          <Paper>
            <Grid container display="flex" alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography variant="body1" fontWeight={600}>Nome</Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="body1" fontWeight={600}>Documento</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Box display="flex" height={1} overflow="auto" flexGrow={1}>
          <Paper className={classes.paperList}>
            {users.map((item, index) => (
              <Box key={index} className={classes.item} pb={1} mb={2}>
                <Grid container display="flex" alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">{item.name}</Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">{item.document}</Typography>
                  </Grid>

                  <Grid item xs={12} md={4} display="flex" alignItems="flex-end" justifyContent="flex-end">
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </Box>
      </Container>
    </>
  )
}

export default Users
