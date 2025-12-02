import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import makeStyles from '@mui/styles/makeStyles'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

import { NEW_PRODUCT_KEYS } from '~/constants/index'
import { PREENCHIMENTO_OBRIGATORIO } from '~/constants/messages'

import colors from '~/shared/theme/colors'
import useTestsForm from '~/shared/hooks/useTestsForm'

import {
  type Mode,
  MODES,
  type ProductType,
  type CreateProductType, type StatusProductType, type TagType
} from '~/models/products'
import { CategoryType } from '~/models/categories'

import ButtonAdd from '~/components/atoms/ButtonAdd'
import AddChips from '~/components/molecules/AddChips'
import Container from '~/components/layout/ContainerMain'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import AddCategories from '~/components/organisms/AddCategories'

import useAlerts from '~/shared/alerts/useAlerts'
import useUtils from '~/shared/hooks/useUtils'
import FormProduct from './FormProduct'
import ChipsCategories from './ChipsCategories'
import { Provider } from '../context'
import { DefaultProduct, DefaultStatusProduct, ShippingKeys } from '../constants'
import FormStatus from './FormStatus'
import ButtonTab from '~/components/atoms/ButtonTab'
import FormVariations from './FormVariations'
import { useCreateProduct } from '~/clients/products/createProduct'
import { useClearTempImages } from '~/clients/products/clearTempImages'
import { useUpdateProduct } from '~/clients/products/updateProduct'
import TitleInformation from '~/components/molecules/TitleInformation'
import { IconProducts } from '~/constants/icons'
import { useGetProductById } from '~/clients/products/getProductById'
import { useNavigate, useParams } from 'react-router-dom'
import FormDescriptions from './FormDescriptions'

const {
  firstInfo: firstInfoKey,
  descriptions: descriptionsKey,
  categories: categoriesKey,
  variations: variationsKey
} = NEW_PRODUCT_KEYS

const TABS_PRODUCT_KEYS = [
  { title: 'Primeiras informações', key: firstInfoKey },
  { title: 'Categorias', key: categoriesKey },
  { title: 'Variações e Mídia', key: variationsKey },
  { title: 'Descrições', key: descriptionsKey }
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
  uniqueValue: 'R$ 0,00'
}

type TypeForm = typeof DEFAULT_VALUES

const New = (): React.JSX.Element => {
  const [product, setProduct] = useState<ProductType | undefined>()
  const [mode, setMode] = useState<Mode>(MODES.create)

  const [selectedTab, setSelectedTab] = useState(firstInfoKey)
  const [openAddCategories, setOpenAddCategories] = useState<boolean>(false)
  const [statusProduct, setStatusProduct] = useState<StatusProductType>(DefaultStatusProduct)

  const styles = useStyles()
  const navigate = useNavigate()
  const { productId } = useParams()
  const { notifyWarning, notifyError } = useAlerts()
  const { greaterThanZero, greaterThanZeroCurrency } = useTestsForm()
  const { formatCurrencyRequest, formatCurrencyString, formatDateISODefault } = useUtils()

  const callbackMutation = (): void => {
    setProduct(undefined)
    navigate('/products')
  }

  const {
    data: resultProduct,
    isSuccess: isSuccessProduct,
    isError: isErrorProdcut,
    error: errorProduct
  } = useGetProductById(productId ?? '')
  const { mutateAsync: mutateCreateProduct } = useCreateProduct(callbackMutation)
  const { mutateAsync: mudateUpdateProduct } = useUpdateProduct(product?.uuid ?? '', callbackMutation)
  const { mutateAsync: clearTempImages } = useClearTempImages()

  const categories = useMemo(() => product?.categories ?? [], [product?.categories])

  const tags = useMemo(() => product?.tags?.split(';') ?? [], [product?.tags])

  console.log('tags1', tags)

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      title: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      subtitle: Yup.string(),
      value: Yup.string().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZeroCurrency),
      uniqueValue: Yup.string(),
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
        tags: product?.tags,
        value: formatCurrencyRequest(data.value),
        uniqueValue: formatCurrencyRequest(data.uniqueValue)
      }

      if (mode === MODES.create) {
        await mutateCreateProduct(payload)
      }

      if (mode === MODES.update && product) {
        await mudateUpdateProduct({ id: product?.uuid ?? '', product: payload })
      }
    }
  })

  const handleAddTags = (t: TagType[]): void => {
    const tagsTyping = t.map((x) => x.title)
    setProduct({ ...product, tags: tagsTyping.join(';') })
  }

  const hasSomeImageInProduct = (): boolean => {
    const variations = product?.variations ?? []
    return variations?.some(v => (v.images?.length ?? 0) > 0)
  }

  const handleChangeTab = (key: string): void => {
    if (key === selectedTab) {
      return
    }
    setSelectedTab(key)
  }

  const getSelectedTab = (key: string): boolean => selectedTab === key

  const handleSetCategories = (categories: CategoryType[]): void => {
    setProduct({ ...product, categories })
  }

  useEffect(() => {
    if (mode === MODES.create) {
      clearTempImages()
    }
  }, [mode, clearTempImages])

  useEffect(() => {
    if (product === undefined) {
      setProduct(DefaultProduct)
    }

    if (!product?.uuid) {
      setMode(MODES.create)
    }

    if (product?.uuid) {
      const {
        title,
        subtitle,
        height,
        length,
        value,
        uniqueValue,
        weight,
        width,
        shipping
      } = product || {}

      formik.setFieldValue('title', title)
      formik.setFieldValue('subtitle', subtitle)
      formik.setFieldValue('height', height)
      formik.setFieldValue('length', length)
      formik.setFieldValue('value', formatCurrencyString(value))
      formik.setFieldValue('valueUnique', formatCurrencyString(uniqueValue))
      formik.setFieldValue('width', width)
      formik.setFieldValue('weight', weight)
      formik.setFieldValue('shipping', shipping)
    }
  }, [product])

  // On get product by id
  useEffect(() => {
    if (isSuccessProduct) {
      setProduct(resultProduct.result ?? {})
      setMode(MODES.update)
    }

    if (isErrorProdcut && errorProduct) {
      notifyError(`${errorProduct.name} - ${errorProduct.message}`)
    }
  }, [isSuccessProduct, isErrorProdcut, errorProduct, productId])

  return (
    <Provider value={{ product, setProduct, mode, setMode }}>
      <Container title={mode === MODES.create ? 'Novo produto' : 'Atualizando produto'} icon={<IconProducts size={30} />}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height={1}>
          <Box>
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={2} className={styles.border}>
              {TABS_PRODUCT_KEYS.map((item, index) => (
                <Box key={`tabs_keys_product-${index}`} display="flex" alignItems="center" gap={1}>
                  <ButtonTab selected={getSelectedTab(item.key)} text={item.title} onClick={() => { handleChangeTab(item.key) }} />

                  {TABS_PRODUCT_KEYS.length !== index + 1 && (
                    <KeyboardDoubleArrowRightIcon />
                  )}
                </Box>
              ))}
            </Box>

            <Box>
              {getSelectedTab(firstInfoKey) && (
                <>
                  <Box mb={3}>
                    <TitleInformation title="Primeiras informações" subtitle="Informações essenciais do produto" />
                    <FormProduct hasImages={hasSomeImageInProduct()} parentFormik={formik} />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TitleInformation title="Status do produto" subtitle="Define quais stickers aparecerão na exibição do produto" />
                      <FormStatus statusProduct={statusProduct} setStatusProduct={setStatusProduct} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TitleInformation title="Tags do produto" subtitle="Define tags que auxiliarão na busca do produto pelo usuário" />
                      <AddChips text="Nome da tag" titleButton="Adicionar tag" data={tags} setData={handleAddTags} />
                      {tags.length === 0 && (<EmptyDataText text="Nenhuma tag adicionada" />)}
                    </Grid>
                  </Grid>
                </>
              )}

              {getSelectedTab(categoriesKey) && (
                <>
                  <Box>
                    <TitleInformation title="Categorias" subtitle="Define em quais categorias o produto se encaixa e onde ele será encontrado no menu" />
                  </Box>

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
                </>
              )}

              {getSelectedTab(variationsKey) && (
                <>
                  <TitleInformation
                    title="Variações"
                    subtitle={`
                    Define variações do produto, por exemplo, Cor e Tamanho. 
                    Cada variação possui um tipo que pode ou não ser adicionadas imagens. 
                    Em caso do produto não possuir variação basta criar um tipo de variação Único que possui imagens.`
                    }
                  />

                  <FormVariations />
                </>
              )}

              {getSelectedTab(descriptionsKey) && (
                <>
                  <FormDescriptions />
                </>
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

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={3} pb={1.5}>
            <Box>
              <Typography>
                <b>Criado em: </b>
                {formatDateISODefault(product?.createdDate)}
              </Typography>

              <Typography>
                <b>Atualizado em: </b>
                {formatDateISODefault(product?.updatedDate)}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="end" gap={1}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setProduct(undefined)
                  navigate('/products')
                }}
              >
                Cancelar
              </Button>
              <Button variant="contained" color="primary" onClick={() => formik.submitForm()}>
                {mode === MODES.create ? 'Criar produto' : 'Atualizar produto'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Provider>
  )
}

export default New
