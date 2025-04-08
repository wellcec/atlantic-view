import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Grid } from '@mui/material'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import makeStyles from '@mui/styles/makeStyles'

import { NEW_PRODUCT_KEYS } from '~/constants/index'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'

import colors from '~/shared/theme/colors'
import useTestsForm from '~/shared/hooks/useTestsForm'

import {
  MODES,
  type CreateProductType, type StatusProductType, type TagType
} from '~/models/products'
import { type CategoryType } from '~/models/categories'

import ButtonAdd from '~/components/atoms/ButtonAdd'
import AddChips from '~/components/molecules/AddChips'
import Container from '~/components/layout/ContainerMain'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import AddCategories from '~/components/organisms/AddCategories'

import useProductsService from '~/services/useProductsService'
import useAlerts from '~/shared/alerts/useAlerts'
import useUtils from '~/shared/hooks/useUtils'
import FormProduct from './FormProduct'
import ChipsCategories from './ChipsCategories'
import { useProductsContext } from '../context'
import { DefaultProduct, DefaultStatusProduct, ShippingKeys } from '../constants'
import FormStatus from './FormStatus'
import useError from '~/shared/hooks/useError'
import ButtonTab from '~/components/atoms/ButtonTab'
import FormVariations from './FormVariations'

const {
  firstInfo: firstInfoKey,
  images: imagesKey,
  categories: categoriesKey,
  variations: variationsKey
} = NEW_PRODUCT_KEYS

const TABS_PRODUCT_KEYS = [
  { title: 'Primeiras informações', key: firstInfoKey },
  { title: 'Categorias', key: categoriesKey },
  { title: 'Variações e Mídia', key: variationsKey },
  { title: 'Mídia', key: imagesKey }
]

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
  },
  border: {
    paddingBottom: 16,
    borderBottom: `1px solid ${colors.background.borderLight}`
  }
}))

const DEFAULT_VALUES = {
  ...DefaultProduct,
  value: 'R$ 0,00',
  valueUnique: 'R$ 0,00'
}

type TypeForm = typeof DEFAULT_VALUES

const New = (): React.JSX.Element => {
  const [selectedTab, setSelectedTab] = useState(firstInfoKey)
  const [tags, setTags] = useState<TagType[]>([])
  const [openAddCategories, setOpenAddCategories] = useState<boolean>(false)
  const [statusProduct, setStatusProduct] = useState<StatusProductType>(DefaultStatusProduct)

  const styles = useStyles()
  const { notifySuccess, notifyWarning } = useAlerts()
  const { showErrorMsg } = useError()
  const { greaterThanZero, greaterThanZeroCurrency } = useTestsForm()
  const { createProduct, updateProduct, clearTempImages } = useProductsService()
  const { mode, setMode, product, setProduct } = useProductsContext()
  const { formatCurrencyRequest, formatCurrencyString } = useUtils()

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
      shipping: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test({
        test: (v: any) => (v === ShippingKeys.free || v === ShippingKeys.correios),
        message: 'Tipo de frete inválido'
      })
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (data: TypeForm) => {
      if (categories.length === 0) {
        notifyWarning('Adicione alguma categoria.')
        return
      }

      const payload: CreateProductType = {
        ...data,
        status: statusProduct,
        categories,
        variations: product?.variations,
        tags: tags.map((t) => t.name),
        value: formatCurrencyRequest(data.value),
        valueUnique: formatCurrencyRequest(data.valueUnique)
      }

      if (mode === MODES.create) {
        await createProduct(payload).then(
          () => {
            setProduct(undefined)
            setMode(MODES.list)
            notifySuccess('Produto criado com sucesso.')
          },
          showErrorMsg
        )
      }

      if (mode === MODES.update && product) {
        await updateProduct(product?.id ?? '', payload).then(
          () => {
            setProduct(undefined)
            setMode(MODES.list)
            notifySuccess('Produto atualizado com sucesso.')
          },
          showErrorMsg
        )
      }
    }
  })

  const categories = useMemo(() => product?.categories ?? [], [product?.categories])

  const hasSomeImageInProduct = (): boolean => {
    const typeVariations = product?.variations ?? []

    return typeVariations.some(tv =>
      tv.hasImages &&
      tv.variations?.some(v => (v.images?.length ?? 0) > 0)
    )
  }

  const handleChangeTab = (key: string): void => {
    if (key === selectedTab) {
      setSelectedTab('')
      return
    }
    setSelectedTab(key)
  }

  const getSelectedTab = (key: string): boolean => selectedTab === key

  const clearTempData = useCallback(() => {
    clearTempImages().then(
      () => { },
      showErrorMsg
    )
  }, [clearTempImages, showErrorMsg])

  const handleSetCategories = (categories: CategoryType[]): void => {
    setProduct({ ...product, categories })
  }

  useEffect(() => {
    if (mode === MODES.create) {
      clearTempData()
    }
  }, [clearTempData, mode])

  useEffect(() => {
    console.log('product', product)

    if (product === undefined) {
      setProduct(DefaultProduct)
    }

    if (!product?.id) {
      setMode(MODES.create)
    }

    if (product?.id) {
      const {
        title,
        subtitle,
        height,
        length,
        value,
        valueUnique,
        weight,
        width,
        shipping
      } = product || {}

      formik.setFieldValue('title', title)
      formik.setFieldValue('subtitle', subtitle)
      formik.setFieldValue('height', height)
      formik.setFieldValue('length', length)
      formik.setFieldValue('value', formatCurrencyString(value))
      formik.setFieldValue('valueUnique', formatCurrencyString(valueUnique))
      formik.setFieldValue('width', width)
      formik.setFieldValue('weight', weight)
      formik.setFieldValue('shipping', shipping)
    }
  }, [product])

  return (
    <Container title={mode === MODES.create ? 'Novo produto' : 'Editar produto'}>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height={1}>
        <Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={2} className={styles.border}>
            {TABS_PRODUCT_KEYS.map((item, index) => (
              <Box key={`tabs_keys_product-${index}`} display="flex" alignItems="center" gap={1}>
                <ButtonTab selected={getSelectedTab(item.key)} text={item.title} onClick={() => { handleChangeTab(item.key) }} />

                {TABS_PRODUCT_KEYS.length !== index + 1 && (
                  <TrendingFlatIcon />
                )}
              </Box>
            ))}
          </Box>

          <Box>
            {getSelectedTab(firstInfoKey) && (
              <>
                <Box mb={3}>
                  <FormProduct hasImages={hasSomeImageInProduct()} parentFormik={formik} />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormStatus statusProduct={statusProduct} setStatusProduct={setStatusProduct} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <AddChips text="Nome da tag" titleButton="Adicionar tag" data={tags} setData={setTags} />
                    {tags.length === 0 && (<EmptyDataText text="Nenhuma tag adicionada" />)}
                  </Grid>
                </Grid>
              </>
            )}

            {getSelectedTab(categoriesKey) && (
              <Box display="flex" alignItems="center" gap={1}>
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
            )}

            {getSelectedTab(variationsKey) && (
              <FormVariations />
            )}

            {openAddCategories && (
              <AddCategories
                data={categories}
                setData={handleSetCategories}
                open={openAddCategories}
                handleClose={() => { setOpenAddCategories(!openAddCategories) }}
              />
            )}
          </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="end" mt={3} pb={1.5} ml="auto">
          <Box display="flex" alignItems="center" justifyContent="end" gap={1}>
            <Button variant="outlined" color="primary" onClick={() => {
              setProduct(undefined)
              setMode(MODES.list)
            }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={() => formik.submitForm()}>
              Criar produto
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default New
