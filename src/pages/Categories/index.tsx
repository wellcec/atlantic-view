import React, { useCallback, useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Grid,
  Button,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import Container from '~/components/layout/ContainerMain'
import { CategoryType, GetAllCategoriesType, SubCategoryType } from 'models/categories'
import Paper from '~/components/layout/Paper'
import Modal from '~/components/molecules/Modal'
import Menu from '~/components/atoms/Menu'
import useCategoriesService from '~/services/useCategoriesService'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import { useAlerts } from '~/shared/alerts/AlertContext'
import useDebounce from '~/shared/hooks/useDebounce'
import Dialog from '~/components/atoms/Dialog'
import InputSearch from '~/components/atoms/Inputs/InputSearch'
import { ISampleFilter } from '~/models'
import { IconDelete, IconEdit } from '~/constants/icons'
import InputForm from '~/components/atoms/Inputs/InputForm'
import AddChips from '~/components/molecules/AddChips'
import Divider from '~/components/atoms/Divider'
import InputText from '~/components/atoms/Inputs/InputText'

const DEFAULT_VALUES = {
  name: '',
}

const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: 10,
}

const Categories = () => {
  const [action, setAction] = useState<'create' | 'update'>('create')
  const [objToAction, setObjToAction] = useState<CategoryType>()
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmatioOpen, setConfirmatioOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const {
    getCategories, createCategory, updateCategory, deleteCategory: deleteCat,
  } = useCategoriesService()
  const { setAlert } = useAlerts()
  const { debounceWait } = useDebounce()

  const getAllCategories = useCallback((newFilter?: ISampleFilter) => {
    getCategories(newFilter || filter).then(
      (response: GetAllCategoriesType) => {
        const { data = [] } = response.data ?? {}
        setSubCategories([])
        setCategories(data)
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      },
    )
  }, [getCategories, setAlert, filter])

  const deleteCategory = useCallback(() => {
    deleteCat(objToAction?.id ?? '').then(
      () => {
        setAlert({ type: 'success', message: 'Categoria excluída com sucesso.' })
        setConfirmatioOpen(false)
        setAnchorEl(null)
        setObjToAction(undefined)
        getAllCategories()
      },
      (error) => {
        const { message } = error
        setAnchorEl(null)
        setAlert({ type: 'error', message })
      },
    )
  }, [deleteCat, objToAction, getAllCategories, setAlert])

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      name: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data) => {
      if (action === 'create') {
        const category: CategoryType = {
          name: data.name,
          subCategories,
        }

        createCategory(category).then(
          () => {
            setAlert({ type: 'success', message: 'Categoria criada com sucesso.' })
            setOpenModal(false)
            getAllCategories()
          },
          (err) => {
            const { message } = err
            setAlert({ type: 'error', message })
            setOpenModal(false)
          },
        )
      }

      if (action === 'update') {
        const category: CategoryType = {
          name: data.name,
          subCategories,
        }

        updateCategory(objToAction?.id ?? '', category).then(
          () => {
            setAlert({ type: 'success', message: 'Categoria atualizada com sucesso.' })
            setAction('create')
            setObjToAction(undefined,)
            setOpenModal(false)
            getAllCategories()
          },
          (err) => {
            const { message } = err
            setAlert({ type: 'error', message })
            setOpenModal(false)
          },
        )
      }
    },
  })

  const handleNewCategory = () => {
    formik.resetForm()
    setSubCategories([])
    setAction('create')
    setOpenModal(true)
  }

  const handleEditCategory = () => {
    const { setValues } = formik
    setValues({ name: objToAction?.name ?? '' })
    setSubCategories(objToAction?.subCategories ?? [])
    setOpenModal(true)
    setAnchorEl(null)
    setAction('update')
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, obj: CategoryType) => {
    setAnchorEl(event.currentTarget)
    setObjToAction(obj)
  }

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

    debounceWait(() => getAllCategories(newFilter))
  }

  useEffect(() => {
    getAllCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Container title="Categorias" fullCard={false}>
        <Box display="flex" flexGrow={0} justifyContent="end" mb={2}>
          <Paper fullWidth>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <Box flexGrow={1} minWidth={500}>
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
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">{item.name}</Typography>
                  </Grid>

                  <Grid item xs={12} md={4} display="flex" flexWrap="wrap" gap={2}>
                    {item.subCategories.map((itemsc, indexsc) => (
                      <Chip key={`subcat-${indexsc}`} label={itemsc?.name} variant="outlined" />
                    ))}
                  </Grid>

                  <Grid item xs={12} md={4} display="flex" alignItems="flex-end" justifyContent="flex-end">
                    <IconButton onClick={(event) => handleOpenMenu(event, item)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>

      <Menu open={openMenu} anchorEl={anchorEl} handleCloseMenu={handleCloseMenu}>
        <MenuItem onClick={handleEditCategory}>
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
          title="Excluir categoria"
          open={confirmatioOpen}
          handleCloseConfirm={handleCloseDelete}
          handleDelete={deleteCategory}
        >
          <Typography variant="body1" color="primary">
            Deseja realmente excluir a categoria
            {' '}
            <b>{objToAction?.name}</b>
            {' '}
            e suas subcategorias?
          </Typography>
        </Dialog>
      )}

      <Modal title={action === 'create' ? 'Nova Categoria' : 'Atualizar Categoria'} open={openModal} handleClose={() => setOpenModal(false)}>
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
          <Button variant="outlined" color="primary" onClick={() => setOpenModal(false)}>
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
