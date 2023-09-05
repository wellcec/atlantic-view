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
  Switch,
  IconButton,
  Pagination,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import Container from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import Menu from '~/components/atoms/Menu'
import { useAlerts } from '~/shared/alerts/AlertContext'
import Dialog from '~/components/atoms/Dialog'
import InputSearch from '~/components/atoms/Inputs/InputSearch'
import { IconDelete, IconEdit } from '~/constants/icons'
import { GetAllProductsType, ProductType, StatusProductType } from '~/models/products'
import useProductsService from '~/services/useProductsService'
import { ISampleFilter } from '~/models'
import useDebounce from '~/shared/hooks/useDebounce'
import { useProducts } from './fragments/context'
import { DEFAULT_PAGESIZE } from '~/constants'

const useStyles = makeStyles(() => ({
  actions: {
    justifyContent: 'space-between',
  },
}))

const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE,
}

const List = () => {
  // const [action, setAction] = useState<'create' | 'update'>('create')
  const [objToAction, setObjToAction] = useState<ProductType>()
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [products, setProducts] = useState<ProductType[]>([])
  const [confirmatioOpen, setConfirmatioOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const classes = useStyles()
  const { setAlert } = useAlerts()
  const { setCreating, creating } = useProducts()
  const { getProducts: getAllProducts, updateStatusProduct, deleteProduct } = useProductsService()
  const { debounceWait } = useDebounce()

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, product: ProductType) => {
    setAnchorEl(event.currentTarget)
    setObjToAction(product)
  }

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    setFilter({ ...filter, page })
  }

  const getProducts = useCallback((newFilter?: ISampleFilter) => {
    getAllProducts(newFilter || filter).then(
      (response: GetAllProductsType) => {
        const { data = [], count } = response.data ?? {}
        setProducts(data)
        setTotalProducts(count)
      },
      (err) => {
        setProducts([])
        setTotalProducts(0)
        const { message } = err
        setAlert({ type: 'error', message })
      },
    )
  }, [filter, getAllProducts, setAlert])

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setObjToAction(undefined)
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

  const handleUpdateStatus = (index: number, id: string, status: StatusProductType) => {
    products[index].status = {
      ...products[index].status,
      ...status,
    }

    setProducts([...products])
    updateStatusProduct(id, status).then(
      () => { },
      (err) => {
        const { message } = err?.data
        setAlert({ type: 'warning', message })
      },
    )
  }

  const handleDelete = () => {
    deleteProduct(objToAction?.id ?? '').then(
      () => {
        getProducts()
        setAlert({ type: 'success', message: 'Produto excluído com sucesso.' })
      },
      (err) => {
        const { message } = err?.data
        setAlert({ type: 'warning', message })
      },
    ).finally(() => {
      setConfirmatioOpen(false)
      setAnchorEl(null)
      setObjToAction(undefined)
    })
  }

  useEffect(() => {
    getProducts(filter)
  }, [filter.page])

  useEffect(() => {
    getProducts()
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

        <Box overflow="auto" flexGrow={1} mb={2}>
          {products.length === 0 && (
            <Box pb={1} mb={2} textAlign="center">
              <Paper>
                <Typography variant="body2">Nenhum produto encontrado</Typography>
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
                    <Typography variant="body2" color="text.quaternary">
                      {product.subtitle}
                    </Typography>
                  </CardContent>

                  <CardActions className={classes.actions}>
                    <Box display="flex" gap={2}>
                      <Box display="flex" alignItems="center" flexDirection="column">
                        <Typography variant="body2" color="text.primary">
                          Ativo
                        </Typography>
                        <Switch
                          size="small"
                          checked={product?.status?.isActive ?? false}
                          onChange={(_, checked: boolean) => handleUpdateStatus(index, product.id, { isActive: checked })}
                        />
                      </Box>

                      <Box display="flex" alignItems="center" flexDirection="column">
                        <Typography variant="body2" color="text.primary">
                          Destaque
                        </Typography>
                        <Switch
                          size="small"
                          checked={product?.status?.isHighlighted ?? false}
                          onChange={(_, checked: boolean) => handleUpdateStatus(index, product.id, { isHighlighted: checked })}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <IconButton onClick={(event) => handleOpenMenu(event, product)}>
                        <MoreVertIcon color="primary" />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {totalProducts > DEFAULT_PAGESIZE && (
          <Box display="flex" justifyContent="center">
            <Pagination
              page={filter.page}
              count={Math.ceil(totalProducts / DEFAULT_PAGESIZE)}
              showFirstButton
              showLastButton
              color="primary"
              onChange={handleChangePage}
            />
          </Box>
        )}
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
          handleDelete={handleDelete}
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
