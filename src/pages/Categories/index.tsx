import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Grid,
  Button,
  Typography,
  IconButton,
  Pagination,
  Hidden
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Container from '~/components/layout/ContainerMain'
import { type CategoryType, type GetAllCategoriesType, type SubCategoryType } from 'models/categories'
import Paper from '~/components/layout/Paper'
import Modal from '~/components/molecules/Modal'
import useCategoriesService from '~/services/useCategoriesService'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import useAlerts from '~/shared/alerts/useAlerts'
import useDebounce from '~/shared/hooks/useDebounce'
import Dialog from '~/components/atoms/Dialog'
import InputSearch from '~/components/atoms/Inputs/InputSearch'
import { ACTIONS, type ActionsType, type ISampleFilter } from '~/models'
import { IconDelete, IconEdit } from '~/constants/icons'
import InputForm from '~/components/atoms/Inputs/InputForm'
import AddChips from '~/components/molecules/AddChips'
import Divider from '~/components/atoms/Divider'
import InputText from '~/components/atoms/Inputs/InputText'
import { DEFAULT_CATEGORY_PAGESIZE as DEFAULT_PAGESIZE } from '~/constants'
import { type ProductType } from '~/models/products'
import useError from '~/shared/hooks/useError'

const DEFAULT_VALUES = {
  name: ''
}

type TypeForm = typeof DEFAULT_VALUES

const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: DEFAULT_PAGESIZE + 3
}

const Categories = (): React.JSX.Element => {
  const [action, setAction] = useState<ActionsType>(ACTIONS.create)
  const [objToAction, setObjToAction] = useState<CategoryType>()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([])
  const [productsByCategory, setProductsByCategory] = useState<ProductType[]>([])
  const [totalByCategory, setTotalByCategory] = useState<number>(0)
  const [totalCategories, setTotalCategories] = useState<number>(0)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)

  const {
    getCategories, createCategory, updateCategory: updateCat, deleteCategory: deleteCat, productByCategory
  } = useCategoriesService()
  const { notifyError, notifySuccess } = useAlerts()
  const { debounceWait } = useDebounce()
  const { showErrorMsg } = useError()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      name: Yup.string().required(PREENCHIMENTO_OBRIGATORIO)
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data: TypeForm) => {
      if (action === ACTIONS.create) {
        const category: CategoryType = {
          name: data.name,
          subCategories
        }

        createCategory(category).then(
          () => {
            notifySuccess('Categoria criada com sucesso.')
            setOpenModal(false)
            getAllCategories()
          },
          (err) => {
            const { message } = err
            notifyError(message)
            setOpenModal(false)
          }
        )
      }

      if (action === ACTIONS.update) {
        productByCategory(objToAction?.id ?? '').then(
          (response) => {
            const { result } = response.data || {}
            if (result.length > 0) {
              setTotalByCategory(result.length)
              setConfirmUpdateOpen(true)
              setProductsByCategory(result)
            } else {
              updateCategory()
            }
          },
          (err) => {
            const { message } = err
            notifyError(message)
            setTotalByCategory(0)
            setConfirmUpdateOpen(false)
            setProductsByCategory([])
          }
        )
      }
    }
  })

  const getAllCategories = useCallback((newFilter?: ISampleFilter) => {
    getCategories(newFilter ?? filter).then(
      (response: GetAllCategoriesType) => {
        const { data = [], count } = response.data ?? {}

        setTotalCategories(count)
        setCategories(data)
      },
      (err) => {
        setTotalCategories(0)
        setCategories([])
        const { message } = err
        notifyError(message)
      }
    )
  }, [getCategories, notifyError, filter])

  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number): void => {
    const newFilter = { ...filter, page }
    setFilter(newFilter)
    getAllCategories(newFilter)
  }

  const deleteCategory = useCallback(() => {
    deleteCat(objToAction?.id ?? '').then(
      () => {
        notifySuccess('Categoria excluída com sucesso.')
        setConfirmOpen(false)
        setObjToAction(undefined)
        getAllCategories()
      },
      showErrorMsg
    )
  }, [deleteCat, objToAction, getAllCategories, notifyError, notifySuccess])

  const updateCategory = useCallback(() => {
    const category: CategoryType = {
      name: formik.values.name,
      subCategories
    }

    updateCat(objToAction?.id ?? '', category).then(
      () => {
        notifySuccess('Categoria atualizada com sucesso.')
        setAction(ACTIONS.create)
        setObjToAction(undefined)
        setOpenModal(false)
        setProductsByCategory([])
        setConfirmUpdateOpen(false)
        setTotalByCategory(0)
        getAllCategories()
      },
      (err) => {
        const { message } = err
        notifyError(message)
        setOpenModal(false)
      }
    )
  }, [formik.values.name, getAllCategories, objToAction?.id, notifySuccess, notifyError, subCategories, updateCat])

  const handleNewCategory = (): void => {
    formik.resetForm()
    setSubCategories([])
    setAction('create')
    setOpenModal(true)
  }

  const handleEditCategory = (obj: CategoryType): void => {
    const { setValues } = formik

    setValues({ name: obj?.name ?? '' })
    setSubCategories(obj?.subCategories ?? [])
    setOpenModal(true)
    setObjToAction(obj)
    setAction(ACTIONS.update)
  }

  const handleConfirmDelete = (obj: CategoryType): void => {
    setObjToAction(obj)
    setConfirmOpen(true)
  }

  const handleCloseDelete = (): void => { setConfirmOpen(false) }

  const handleCloseConfirmUpdate = (): void => { setConfirmUpdateOpen(false) }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { value } = event.target
    const newFilter = { ...filter, term: value }
    setFilter(newFilter)

    debounceWait(() => { getAllCategories(newFilter) })
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  return (
    <>
      <Container title="Categorias" fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <Paper fullWidth>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <Box flexGrow={1}>
                <InputSearch placeholder="Procure por nome e subcagetoria..." onChange={handleChangeSearch} />
              </Box>

              <Box>
                <Button variant="contained" color="success" onClick={handleNewCategory}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box>
                      <AddIcon />
                    </Box>

                    <Box>
                      Nova Categoria
                    </Box>
                  </Box>
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>

        <Hidden mdDown>
          <Box mb={2} flexGrow={0}>
            <Paper>
              <Grid container display="flex" alignItems="center">
                <Grid item xs={2}>
                  <Typography variant="body1" fontWeight={600}>Categoria</Typography>
                </Grid>

                <Grid item xs={7}>
                  <Typography variant="body1" fontWeight={600}>Sub categorias</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Hidden>

        <Box overflow="auto" flexGrow={1}>
          {categories.length === 0 && (
            <Box pb={1} mb={2} textAlign="center">
              <Paper>
                <Typography variant="body2">Nenhuma categoria cadastrada</Typography>
              </Paper>
            </Box>
          )}

          {categories.map((item, index) => (
            <Box key={index} pb={1} mb={2}>
              <Paper>
                <Grid container display="flex" alignItems="center">
                  <Grid item xs={12} md={2}>
                    <Typography variant="body2">{item.name}</Typography>

                    <Hidden mdUp>
                      <Box mb={2} />
                    </Hidden>
                  </Grid>

                  <Grid item xs={12} md={7} display="flex" flexWrap="wrap" gap={2}>
                    {item.subCategories.map((itemsc, indexsc) => (
                      <Chip key={`subcat-${indexsc}`} label={itemsc?.name} variant="outlined" />
                    ))}
                  </Grid>

                  <Grid item xs={12} md={3} display="flex" alignItems="flex-end" justifyContent="flex-end" gap={1}>
                    <Box>
                      <IconButton title="Editar" onClick={() => { handleEditCategory(item) }}>
                        <IconEdit size={25} />
                      </IconButton>
                    </Box>

                    <Box>
                      <IconButton title="Excluir" onClick={() => { handleConfirmDelete(item) }}>
                        <IconDelete size={25} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ))}
        </Box>

        {totalCategories > DEFAULT_PAGESIZE && (
          <Box display="flex" justifyContent="center">
            <Pagination
              page={filter.page}
              count={Math.ceil(totalCategories / DEFAULT_PAGESIZE)}
              showFirstButton
              showLastButton
              color="primary"
              onChange={handleChangePage}
            />
          </Box>
        )}
      </Container>

      {confirmOpen && (
        <Dialog
          title="Excluir categoria"
          open={confirmOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={deleteCategory}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir a categoria
            {' '}
            <b>{objToAction?.name}</b>
            {' '}
            e suas sub categorias?
          </Typography>
        </Dialog>
      )}

      {confirmUpdateOpen && (
        <Dialog
          title="Alterar categoria"
          open={confirmUpdateOpen}
          handleCloseConfirm={handleCloseConfirmUpdate}
          handleDelete={updateCategory}
        >
          <Typography variant="body1" color="primary">
            Esses produtos possuem essa categoria?
          </Typography>

          <Box mb={2}>
            <Box component="ul">
              {productsByCategory.map((item, index) => (
                <>
                  {index < 9 && (
                    <Box key={`productsByCategory-${index}`} component="li">
                      {item.title}
                    </Box>
                  )}
                </>
              ))}

              {totalByCategory > 10 && ` ... mais ${totalByCategory - 10} produtos.`}
            </Box>
          </Box>

          <Box>
            <Typography variant="body1" color="primary">
              Deseja continuar?
            </Typography>
          </Box>
        </Dialog>
      )}

      <Modal title={action === 'create' ? 'Nova Categoria' : 'Atualizar Categoria'} open={openModal} handleClose={() => { setOpenModal(false) }}>
        <Box minWidth={600} maxWidth={900} mb={3}>
          <Box mb={4}>
            <InputForm fullWidth title="Nome da categoria*" helperText formik={formik} propField="name">
              <InputText
                placeholder="Informe um nome"
                {...formik.getFieldProps('name')}
                error={formik.touched.name && !!formik.errors.name}
              />
            </InputForm>
          </Box>

          <Divider title="Adicione sub categorias" />

          <Box mt={4} mb={2}>
            <AddChips text="Nome da sub categoria" titleButton="Adicionar subcategoria" data={subCategories} setData={setSubCategories} />
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="end" gap={1}>
          <Button variant="outlined" color="primary" onClick={() => { setOpenModal(false) }}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={() => formik.submitForm()}>
            Salvar
          </Button>
        </Box>
      </Modal>
    </>
  )
}

export default Categories
