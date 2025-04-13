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
import { useProductsContext } from '../context'
import { DEFAULT_PAGESIZE } from '~/constants'
import CardProduct from './CardProduct'
import { useGetProducts } from '~/clients/products/getProducts'
import { useUpdateStatusProduct } from '~/clients/products/updateStatusProduct'
import { useGetProductById } from '~/clients/products/getProductById'
import { useDeleteProduct } from '~/clients/products/deleteProduct'

const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE
}

const List = (): React.JSX.Element => {
  const [objToAction, setObjToAction] = useState<ProductType>()
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [products, setProducts] = useState<ProductType[]>([])
  const [productId, setProductId] = useState<string>('')
  const [confirmatioOpen, setConfirmatioOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const { notifyError, notifyWarning, notifySuccess } = useAlerts()
  const { mode, setMode, setProduct } = useProductsContext()
  // const { getProducts, updateStatusProduct, deleteProduct, getProductById } = useProductsService()
  const { debounceWait } = useDebounce()

  // List products
  const {
    data: resultProducts,
    isSuccess: isSuccessProducts,
    isError: isErrorProducts,
    error: errorProducts,
    refetch: refetchProducts
  } = useGetProducts(filter)

  // Update product
  const { mutate: mutateStatusProduct } = useUpdateStatusProduct()

  // Get product by id
  const {
    data: resultProductToUpdate,
    isSuccess: isSuccessProductUpdate,
    isError: isErrorProdcutUpdate,
    error: errorProductUpdate
  } = useGetProductById(productId)

  // Delete product
  const { mutateAsync: mutateDeleteProduct } = useDeleteProduct(() => {
    setConfirmatioOpen(false)
    setAnchorEl(null)
    setObjToAction(undefined)
  }, filter)

  // -------

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, product: ProductType): void => {
    setAnchorEl(event.currentTarget)
    setObjToAction(product)
  }

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number): void => {
    const newFilter = { ...filter, page }
    setFilter(newFilter)
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

    debounceWait(() => {
      setFilter(newFilter)
    })
  }

  const handleUpdateStatus = (index: number, id: string, status: StatusProductType): void => {
    products[index].status = {
      ...products[index].status,
      ...status
    }

    mutateStatusProduct({ id, status: products[index].status })
  }

  const handleDelete = (): void => {
    mutateDeleteProduct(objToAction?.id ?? '')
  }

  const handleEdit = (id: string): void => {
    setProductId(id)
  }

  // On get products
  useEffect(() => {
    if (mode === MODES.list && isSuccessProducts) {
      setProducts(resultProducts?.data ?? [])
      setTotalProducts(resultProducts?.count ?? 0)
    }

    if (isErrorProducts && errorProducts) {
      setProducts([])
      setTotalProducts(0)
      notifyError(`${errorProducts.name} - ${errorProducts.message}`)
    }
  }, [mode, isSuccessProducts, isErrorProducts, errorProducts, resultProducts])

  // On get product by id
  useEffect(() => {
    if (isSuccessProductUpdate) {
      setProduct(resultProductToUpdate.result ?? {})
      setMode(MODES.update)
    }

    if (isErrorProdcutUpdate && errorProductUpdate) {
      notifyError(`${errorProductUpdate.name} - ${errorProductUpdate.message}`)
    }
  }, [isSuccessProductUpdate, isErrorProdcutUpdate, errorProductUpdate])

  // useEffect(() => {
  //   if (mode === MODES.list) {
  //     refetchProducts()
  //   }
  // }, [mode])

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
