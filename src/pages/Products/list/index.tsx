import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Grid,
  Pagination
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import Container from '~/components/layout/ContainerMain'
import Paper from '~/components/layout/Paper'
import Menu from '~/components/atoms/Menu'
import useAlerts from '~/shared/alerts/useAlerts'
import Dialog from '~/components/atoms/Dialog'
import InputSearch from '~/components/atoms/Inputs/InputSearch'
import { IconDelete, IconEdit } from '~/constants/icons'
import { MODES, type GetAllProductsType, type ProductType, type StatusProductType } from '~/models/products'
import useProductsService from '~/services/useProductsService'
import { type ISampleFilter } from '~/models'
import useDebounce from '~/shared/hooks/useDebounce'
import { useProductsContext } from '../fragments/context'
import { DEFAULT_PAGESIZE } from '~/constants'
import CardProduct from './CardProduct'

const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

const List = (): React.JSX.Element => {
  const [objToAction, setObjToAction] = useState<ProductType>()
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [products, setProducts] = useState<ProductType[]>([])
  const [confirmatioOpen, setConfirmatioOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const { notifyError, notifyWarning, notifySuccess } = useAlerts()
  const { mode, setMode, setProduct } = useProductsContext()
  const { getProducts: getAllProducts, updateStatusProduct, deleteProduct, getProductById } = useProductsService()
  const { debounceWait } = useDebounce()

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, product: ProductType): void => {
    setAnchorEl(event.currentTarget)
    setObjToAction(product)
  }

  const getProducts = useCallback((newFilter?: ISampleFilter) => {
    getAllProducts(newFilter ?? filter).then(
      (response: GetAllProductsType) => {
        const { data = [], count } = response.data ?? {}
        setProducts(data)
        setTotalProducts(count)
      },
      (err) => {
        setProducts([])
        setTotalProducts(0)
        const { message } = err
        notifyError(message)
      }
    )
  }, [filter, getAllProducts, notifyError])

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number): void => {
    const newFilter = { ...filter, page }
    setFilter(newFilter)
    getProducts(newFilter)
  }

  const handleCloseMenu = (): void => {
    setAnchorEl(null)
    setObjToAction(undefined)
  }

  const handleConfirmDelete = (): void => {
    setAnchorEl(null)
    setConfirmatioOpen(true)
  }

  const handleCloseDelete = (): void => {
    setConfirmatioOpen(false)
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target
    const newFilter = { ...filter, term: value }
    setFilter(newFilter)

    debounceWait(() => { getProducts(newFilter) })
  }

  const handleUpdateStatus = (index: number, id: string, status: StatusProductType): void => {
    products[index].status = {
      ...products[index].status,
      ...status
    }

    setProducts([...products])
    updateStatusProduct(id, status).then(
      () => { },
      (err) => {
        const { message } = err?.data ?? {}
        notifyWarning(message)
      }
    )
  }

  const handleDelete = (): void => {
    deleteProduct(objToAction?.id ?? '').then(
      () => {
        getProducts()
        notifySuccess('Produto excluído com sucesso.')
      },
      (err) => {
        const { message } = err?.data ?? {}
        notifyError(message)
      }
    ).finally(() => {
      setConfirmatioOpen(false)
      setAnchorEl(null)
      setObjToAction(undefined)
    })
  }

  const handleEdit = (id: string): void => {
    getProductById(id).then(
      (response) => {
        setProduct(response?.data ?? undefined)
        setMode(MODES.update)
      },
      (err) => {
        const { message } = err?.data ?? {}
        notifyError(message)
      }
    )
  }

  useEffect(() => {
    if (mode === MODES.list) {
      getProducts()
    }
  }, [mode, getProducts])

  return (
    <>
      <Container title="Produtos" fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <Paper fullWidth>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <Box flexGrow={1}>
                <InputSearch placeholder="Procure por título ou subtítulo..." onChange={handleChangeSearch} />
              </Box>

              <Box>
                <Button variant="contained" color="success" onClick={() => { setMode(MODES.create) }}>
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
                <CardProduct
                  index={index}
                  product={product}
                  handleEdit={handleEdit}
                  handleOpenMenu={handleOpenMenu}
                  handleUpdateStatus={handleUpdateStatus}
                />
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
