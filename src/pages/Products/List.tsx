import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material'
// import makeStyles from '@mui/styles/makeStyles'
import AddIcon from '@mui/icons-material/Add'
import Container from 'components/layout/ContainerMain'
import Paper from 'components/layout/Paper'
import Menu from 'components/atoms/Menu'
import { useAlerts } from 'shared/alerts/AlertContext'
// import useDebounce from 'shared/hooks/useDebounce'
import Dialog from 'components/atoms/Dialog'
import InputSearch from 'components/atoms/Inputs/InputSearch'
// import { SampleFilter } from 'models'
import { IconDelete, IconEdit } from 'constants/icons'
import { GetAllProductsType, ProductType } from 'models/products'
import useProductsService from 'services/useProductsService'
import { ISampleFilter } from 'models'
import useDebounce from 'shared/hooks/useDebounce'
import { useProducts } from './fragments/context'

const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: 10,
}

const List = () => {
  // const [action, setAction] = useState<'create' | 'update'>('create')
  const [objToAction, setObjToAction] = useState<ProductType>()
  const [products, setProducts] = useState<ProductType[]>([])
  const [confirmatioOpen, setConfirmatioOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const { setAlert } = useAlerts()
  const { setCreating, creating } = useProducts()
  const { getProducts: getAllProducts } = useProductsService()
  const { debounceWait } = useDebounce()

  // const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  const getProducts = useCallback((newFilter?: ISampleFilter) => {
    getAllProducts(newFilter || filter).then(
      (response: GetAllProductsType) => {
        const { data = [] } = response.data ?? {}
        setProducts(data)
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      },
    )
  }, [filter, getAllProducts, setAlert])

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

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    const newFilter = { ...filter, term: value }
    setFilter(newFilter)

    debounceWait(() => getProducts(newFilter))
  }

  useEffect(() => {
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creating])

  return (
    <>
      <Container title="Produtos" fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <Paper fullWidth>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <Box flexGrow={1} minWidth={500}>
                <InputSearch placeholder="Procure por título ou subtítulo..." onChange={handleChangeSearch} />
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

          <Grid container spacing={2}>
            {products.map((product, index) => (
              <Grid item xs={12} md={4} lg={3} key={`products-${index}`}>
                <Card>
                  <CardMedia
                    sx={{ height: 200 }}
                    image={`images/${product.images[0].fileName}`}
                    title={product.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="body1">
                      {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.subtitle}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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
            <b>{objToAction?.title}</b>
            {' '}
            ?
          </Typography>
        </Dialog>
      )}
    </>
  )
}

export default List
