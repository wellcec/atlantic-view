import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Button,
  MenuItem,
} from '@mui/material'
// import makeStyles from '@mui/styles/makeStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import Container from 'components/layout/ContainerMain'
import Paper from 'components/layout/Paper'
import Menu from 'components/atoms/Menu'
// import { useAlerts } from 'shared/alerts/AlertContext'
// import useDebounce from 'shared/hooks/useDebounce'
import Dialog from 'components/atoms/Dialog'
import InputSearch from 'components/atoms/Inputs/InputSearch'
// import { SampleFilter } from 'models'
import { IconDelete, IconEdit } from 'constants/icons'
import { ProductType } from 'models/products'
import { useProducts } from './fragments/context'

// const emptyFilter: SampleFilter = {
//   term: '',
//   page: 1,
//   pageSize: 10,
// }

const List = () => {
  // const [action, setAction] = useState<'create' | 'update'>('create')
  const [objToAction, setObjToAction] = useState<ProductType>()
  const [products] = useState<ProductType[]>([])
  const [confirmatioOpen, setConfirmatioOpen] = useState<boolean>(false)
  // const [filter, setFilter] = useState<SampleFilter>(emptyFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  // const { setAlert } = useAlerts()
  const { setCreating } = useProducts()

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setObjToAction(null)
  }

  const handleConfirmDelete = () => {
    setAnchorEl(null)
    setConfirmatioOpen(true)
  }

  const handleCloseDelete = () => {
    setConfirmatioOpen(false)
  }

  useEffect(() => {
    // getAllCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container title="Produtos" fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <Paper fullWidth>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <Box flexGrow={1} minWidth={500}>
                <InputSearch placeholder="Procure por nome e subcagetoria..." onChange={() => { }} />
              </Box>

              <Box>
                <Button variant="contained" color="success" onClick={() => setCreating(true)}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box>
                      <AddIcon />
                    </Box>

                    <Box>
                      Novo Produto
                    </Box>
                  </Box>
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Box overflow="auto" flexGrow={1}>
          {products.length === 0 && (
            <Box pb={1} mb={2} textAlign="center">
              <Paper>
                <Typography variant="body2">Nenhum produto cadastrado</Typography>
              </Paper>
            </Box>
          )}

          {products.map((item, index) => (
            <Box key={index} pb={1} mb={2}>
              <Paper>
                {item.name}
                <IconButton onClick={(event) => handleOpenMenu(event)}>
                  <MoreVertIcon />
                </IconButton>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>

      <Menu open={openMenu} anchorEl={anchorEl} handleCloseMenu={handleCloseMenu}>
        <MenuItem>
          <Box display="flex" alignItems="center" gap={2}>
            <IconEdit />
            <Typography variant="body1" color="primary">Editar</Typography>
          </Box>
        </MenuItem>

        <MenuItem onClick={handleConfirmDelete}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconDelete />
            <Typography variant="body1" color="primary">Excluir</Typography>
          </Box>
        </MenuItem>
      </Menu>

      {confirmatioOpen && (
        <Dialog
          title="Excluir produto"
          open={confirmatioOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={() => { }}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir o produto
            {' '}
            <b>{objToAction?.name}</b>
            {' '}
            ?
          </Typography>
        </Dialog>
      )}
    </>
  )
}

export default List
