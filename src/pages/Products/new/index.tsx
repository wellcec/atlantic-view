import React, { useCallback, useEffect, useState } from 'react'
import {
  Box, Button, Chip,
  Grid, ImageList, ImageListItem, ImageListItemBar, Typography
} from '@mui/material'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import makeStyles from '@mui/styles/makeStyles'

import { NEW_PRODUCT_KEYS } from '~/constants/index'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'
import { IconSingleArrowDownCircule, IconSingleArrowUpCircule } from '~/constants/icons'

import colors from '~/shared/theme/colors'
import useTestsForm from '~/shared/hooks/useTestsForm'

import {
  type CreateProductType, type ImageType, type StatusProductType, type TagType
} from 'models/products'
import { type CategoryType } from '~/models/categories'
import { type VariationType } from '~/models/variations'

import ButtonAdd from '~/components/atoms/ButtonAdd'
import AddChips from '~/components/molecules/AddChips'
import Accordion from '~/components/molecules/Accordion'
import Container from '~/components/layout/ContainerMain'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import AddVariations from '~/components/organisms/AddVariations'
import AddCategories from '~/components/organisms/AddCategories'

import useProductsService from '~/services/useProductsService'
import { useAlerts } from '~/shared/alerts/AlertContext'
import ButtonRemove from '~/components/atoms/ButtonRemove'
import useUtils from '~/shared/hooks/useUtils'
import Images from './Images'
import FormProduct from './FormProduct'
import ChipsCategories from './ChipsCategories'
import { useProductsContext } from '../fragments/context'
import { ShippingKeys } from '../fragments/constants'
import FormStatus from './FormStatus'

const {
  firstInfo: firstInfoKey,
  images: imagesKey,
  categories: categoriesKey,
  tags: tagsKey,
  variations: variationsKey,
  status: statusKey
} = NEW_PRODUCT_KEYS

const useStyles = makeStyles(() => ({
  img: {
    borderRadius: 5
  },
  list: {
    paddingTop: 15,
    paddingRight: 15,
    marginTop: 0
  },
  imageBar: {
    background: 'inherit !important',
    padding: 8
  }
}))

const DEFAULT_VALUES = {
  title: '',
  subtitle: '',
  value: 'R$ 0,00',
  valueUnique: 'R$ 0,00',
  weight: 0,
  height: 0,
  length: 0,
  width: 0,
  shipping: ShippingKeys.correios
}

const New = (): React.JSX.Element => {
  const [panelAccordion, setPanelAccordion] = useState(firstInfoKey)
  const [allExpanded, setAllExpanded] = useState(true)
  const [tags, setTags] = useState<TagType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [openAddCategories, setOpenAddCategories] = useState<boolean>(false)
  const [variations, setVariations] = useState<VariationType[]>([])
  const [images, setImages] = useState<ImageType[]>([])
  const [openAddVariations, setOpenAddVariations] = useState<boolean>(false)
  const [openAddImages, setOpenAddImages] = useState<boolean>(false)
  const [statusProduct, setStatusProduct] = useState<StatusProductType>({
    isLaunch: false,
    isSale: false,
    isBestSeller: false,
    isPreOrder: false
  })

  const classes = useStyles()
  const { setAlert } = useAlerts()
  const { greaterThanZero, greaterThanZeroCurrency } = useTestsForm()
  const { getAllImages, deleteImageById, createProduct, updateProduct } = useProductsService()
  const { mode, setMode, product, setProduct } = useProductsContext()
  const { formatCurrencyRequest, formatFormCurrency, formatNumber } = useUtils()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      title: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      subtitle: Yup.string(),
      value: Yup.string().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZeroCurrency),
      valueUnique: Yup.string(),
      weight: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      height: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      length: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      width: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      shipping: Yup.string().required(PREENCHIMENTO_OBRIGATORIO).test({
        test: (v) => (v === ShippingKeys.free || v === ShippingKeys.correios),
        message: 'Tipo de frete inválido'
      })
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data) => {
      const payload: CreateProductType = {
        ...data,
        status: statusProduct,
        categories,
        variations,
        tags,
        images,
        value: formatCurrencyRequest(data.value),
        valueUnique: formatCurrencyRequest(data.valueUnique)
      }

      if (mode === 'create') {
        createProduct(payload).then(
          () => {
            setMode('list')
            setAlert({ type: 'success', message: 'Produto criado com sucesso.' })
          },
          (err) => {
            const { message } = err
            setAlert({ type: 'error', message })
          }
        )
      }

      if (mode === 'update' && product) {
        updateProduct(product?.id, payload).then(
          () => {
            setMode('list')
            setAlert({ type: 'success', message: 'Produto atualizado com sucesso.' })
          },
          (err) => {
            const { message } = err
            setAlert({ type: 'error', message })
          }
        )
      }
    }
  })

  const { title: titleProduct } = formik?.values ?? {}

  const handleChangeAccordion = (key: string): void => {
    if (key === panelAccordion) {
      setPanelAccordion('')
      return
    }
    setPanelAccordion(key)
  }

  const getExpanded = (key: string): boolean => allExpanded || panelAccordion === key

  const handleAddImages = (): void => {
    if (titleProduct && titleProduct !== '') {
      setOpenAddImages(!openAddImages)
    } else {
      setAlert({ type: 'warning', message: 'Nome do produto é necessário.' })
    }
  }

  const getImages = useCallback(() => {
    getAllImages().then(
      (response) => {
        const { data = [] } = response?.data || {}
        setImages(data)
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      }
    )
  }, [getAllImages, setAlert])

  const onCreateImage = (image: ImageType): void => {
    setImages([...images, image])
  }

  const deleteImage = useCallback((id: string) => {
    deleteImageById(id).then(
      () => {
        getImages()
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      }
    )
  }, [deleteImageById, getImages, setAlert])

  useEffect(() => {
    if (mode === 'create') {
      getImages()
    }
  }, [getImages, mode])

  useEffect(() => {
    if (product) {
      const {
        title,
        subtitle,
        height,
        length,
        status,
        value,
        valueUnique,
        weight,
        width,
        tags = [],
        images = [],
        categories = [],
        variations = []
      } = product || {}

      formik.setFieldValue('title', title)
      formik.setFieldValue('subtitle', subtitle)
      formik.setFieldValue('height', height)
      formik.setFieldValue('length', length)
      formik.setFieldValue('value', formatFormCurrency(formatNumber(value, 'float')))
      formik.setFieldValue('valueUnique', formatFormCurrency(formatNumber(valueUnique, 'float')))
      formik.setFieldValue('width', width)
      formik.setFieldValue('weight', weight)

      setCategories(categories)
      setImages(images)
      setStatusProduct({
        isBestSeller: status.isBestSeller,
        isLaunch: status.isLaunch,
        isPreOrder: status.isPreOrder,
        isSale: status.isSale
      })
      setTags(tags)
      setVariations(variations)
    }
  }, [product])

  return (
    <Container title={mode === 'create' ? 'Novo produto' : 'Editar produto'}>
      <Box display="flex" justifyContent="end">
        <Button variant="text" onClick={() => { setAllExpanded(!allExpanded) }}>
          <Box display="flex" alignItems="center" gap={2} mx={1.5}>
            <Typography variant="body2" color="primary">
              Expandir todos
            </Typography>

            {!allExpanded && <IconSingleArrowDownCircule color={colors.primary.main} />}
            {allExpanded && <IconSingleArrowUpCircule color={colors.primary.main} />}
          </Box>
        </Button>
      </Box>

      <Box>
        <Accordion open={getExpanded(firstInfoKey)} title="Primeiras informações" onChange={() => { handleChangeAccordion(firstInfoKey) }}>
          <FormProduct hasImages={images.length > 0} parentFormik={formik} />
        </Accordion>

        <Accordion open={getExpanded(statusKey)} title="Status" onChange={() => { handleChangeAccordion(statusKey) }}>
          <FormStatus statusProduct={statusProduct} setStatusProduct={setStatusProduct} />
        </Accordion>

        <Accordion open={getExpanded(imagesKey)} title="Imagens" onChange={() => { handleChangeAccordion(imagesKey) }}>
          <Box display="flex">
            <Box width={1} mt={0} mx={2}>
              <ImageList variant="masonry" cols={4} gap={10} className={classes.list}>
                {images.map((img, index) => (
                  <ImageListItem key={`image-temp-${index}`}>
                    <img
                      key={`temp-image-temp-${index}`}
                      className={classes.img}
                      src={`images/${img.fileName}`}
                      srcSet={`images/${img.fileName}`}
                      alt={img.fileName}
                      loading="lazy"
                    />

                    <ImageListItemBar
                      className={classes.imageBar}
                      actionIcon={
                        <ButtonRemove title="Remover imagem" onClick={() => { deleteImage(img.id) }} />
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>

            <Box display="flex">
              <ButtonAdd title="Adicionar imagem" onClick={handleAddImages} />
            </Box>
          </Box>
        </Accordion>

        {(openAddImages && formik.values.title !== '') && (
          <Images
            open={openAddImages}
            lengthImages={images?.length ?? 0}
            titleProduct={titleProduct}
            onCreateImage={onCreateImage}
            handleClose={() => { setOpenAddImages(!openAddImages) }}
          />
        )}

        <Accordion open={getExpanded(categoriesKey)} title="Categorias" onChange={() => { handleChangeAccordion(categoriesKey) }}>
          <Box display="flex">
            <Box width={1}>
              {categories.length === 0 && (<EmptyDataText text="Nenhuma categoria adicionada" />)}

              {categories?.length > 0 && (
                <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                  {categories?.map((cat, indexCat) => (
                    <React.Fragment key={`chip-cat-${indexCat}`}>
                      <ChipsCategories category={cat} />
                    </React.Fragment>
                  ))}
                </Box>
              )}
            </Box>

            <Box display="flex" alignItems="center">
              <ButtonAdd title="Adicionar categoria" onClick={() => { setOpenAddCategories(!openAddCategories) }} />
            </Box>
          </Box>
        </Accordion>

        {openAddCategories && (
          <AddCategories
            data={categories}
            setData={setCategories}
            open={openAddCategories}
            handleClose={() => { setOpenAddCategories(!openAddCategories) }}
          />
        )}

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Accordion open={getExpanded(variationsKey) || getExpanded(tagsKey)} title="Variações" onChange={() => { handleChangeAccordion(variationsKey) }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={1}>
                    {variations.length === 0 && (<EmptyDataText text="Nenhuma variação adicionada" />)}

                    {variations?.length > 0 && (
                      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                        {variations?.map((variation, indexVar) => (
                          <Chip
                            key={`chip-${indexVar}`}
                            label={variation?.name}
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                  <ButtonAdd title="Adicionar variação" onClick={() => { setOpenAddVariations(!openAddVariations) }} />
                </Box>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion open={getExpanded(tagsKey) || getExpanded(variationsKey)} title="Tags" onChange={() => { handleChangeAccordion(tagsKey) }}>
                <AddChips text="Nome da tag" titleButton="Adicionar adicionada" data={tags} setData={setTags} />

                {tags.length === 0 && (<EmptyDataText text="Nenhuma tag adicionada" />)}
              </Accordion>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {openAddVariations && (
        <AddVariations
          data={variations}
          setData={setVariations}
          open={openAddVariations}
          handleClose={() => { setOpenAddVariations(!openAddVariations) }}
        />
      )}

      <Box display="flex" alignItems="center" justifyContent="end" position="sticky" bottom={8} right={16} pt={4} width="fit-content" ml="auto">
        <Box display="flex" alignItems="center" justifyContent="end" gap={1}>
          <Button variant="outlined" color="primary" onClick={() => {
            setProduct(undefined)
            setMode('list')
          }}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={() => formik.submitForm()}>
            Salvar
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default New
