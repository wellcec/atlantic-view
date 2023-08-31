/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-dynamic-require */
import React, { useCallback, useEffect, useState } from 'react'
import {
  Box, Button, Chip, Grid, ImageList, ImageListItem, Typography,
} from '@mui/material'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import makeStyles from '@mui/styles/makeStyles'

import { NEW_PRODUCT_KEYS } from 'constants/index'
import { PREENCHIMENTO_OBRIGATORIO } from 'constants/messages'
import { IconSingleArrowDownCircule, IconSingleArrowUpCircule } from 'constants/icons'

import colors from 'shared/theme/colors'
import useTestsForm from 'shared/hooks/useTestsForm'

import { ImageType, TagType } from 'models/products'
import { CategoryType } from 'models/categories'
import { VariationType } from 'models/variations'

import ButtonAdd from 'components/atoms/ButtonAdd'
import AddChips from 'components/molecules/AddChips'
import Accordion from 'components/molecules/Accordion'
import Container from 'components/layout/ContainerMain'
import EmptyDataText from 'components/atoms/EmptyDataText'
import AddVariations from 'components/organisms/AddVariations'
import AddCategories from 'components/organisms/AddCategories'

import useProductsService from 'services/useProductsService'
import { useAlerts } from 'shared/alerts/AlertContext'
import Images from './Images'
import FormProduct from './FormProduct'
import ChipsCategories from './ChipsCategories'

const {
  firstInfo: firstInfoKey,
  images: imagesKey,
  categories: categoriesKey,
  tags: tagsKey,
  variations: variationsKey,
} = NEW_PRODUCT_KEYS

const useStyles = makeStyles(() => ({
  img: {
    borderRadius: 5,
  },
  list: {
    marginTop: 0,
  },
}))

const DEFAULT_VALUES = {
  title: '',
  subtitle: '',
  value: 'R$ 0,00',
  valueUnique: 'R$ 0,00',
  weight: '',
  height: '',
  length: '',
  width: '',
}

const New = () => {
  const [panelAccordion, setPanelAccordion] = useState(firstInfoKey)
  const [allExpanded, setAllExpanded] = useState(true)
  const [tags, setTags] = useState<TagType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [openAddCategories, setOpenAddCategories] = useState<boolean>(false)
  const [variations, setVariations] = useState<VariationType[]>([])
  const [images, setImages] = useState<ImageType[]>([])
  const [openAddVariations, setOpenAddVariations] = useState<boolean>(false)
  // const [categoriesOptions, setCategoriesOptions] = useState<CategoryType[]>([])
  const [openAddImages, setOpenAddImages] = useState<boolean>(false)

  const classes = useStyles()
  const { setAlert } = useAlerts()
  const { greaterThanZero, greaterThanZeroCurrency } = useTestsForm()
  const { getImages: getAllImages } = useProductsService()

  const formik = useFormik({
    initialValues: DEFAULT_VALUES,
    validationSchema: Yup.object({
      title: Yup.string().required(PREENCHIMENTO_OBRIGATORIO),
      subtitle: Yup.string(),
      value: Yup.string().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZeroCurrency),
      valueUnique: Yup.string().test(greaterThanZeroCurrency),
      weight: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      height: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      length: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
      width: Yup.number().required(PREENCHIMENTO_OBRIGATORIO).test(greaterThanZero),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (data) => {
      console.log('data', data)
    },
  })

  const handleChangeAccordion = (key: string) => {
    if (key === panelAccordion) {
      setPanelAccordion('')
      return
    }
    setPanelAccordion(key)
  }

  const getExpanded = (key: string) => allExpanded || panelAccordion === key

  const getImages = useCallback(() => {
    getAllImages().then(
      async (response) => {
        const { data = [] } = response?.data || {}
        setImages(data)
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      },
    )
  }, [getAllImages, setAlert])

  useEffect(() => {
    getImages()
  }, [getImages])

  return (
    <Container title="Novo produto">
      <Box display="flex" justifyContent="end">
        <Button variant="text" onClick={() => setAllExpanded(!allExpanded)}>
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
        <Accordion open={getExpanded(firstInfoKey)} title="Primeiras informações" onChange={() => handleChangeAccordion(firstInfoKey)}>
          <FormProduct parentFormik={formik} />
        </Accordion>

        <Accordion open={getExpanded(imagesKey)} title="Imagens" onChange={() => handleChangeAccordion(imagesKey)}>
          <Box display="flex">
            <Box width={1} mt={0} mx={2}>

              <ImageList variant="masonry" cols={4} gap={10} className={classes.list}>
                {images.map((img) => (
                  <ImageListItem>
                    <img
                      className={classes.img}
                      src={`${img.base64}`}
                      srcSet={`${img.base64}`}
                      alt={img.fileName}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>

            <Box display="flex">
              <ButtonAdd title="Adicionar imagem" onClick={() => setOpenAddImages(!openAddImages)} />
            </Box>
          </Box>
        </Accordion>

        {openAddImages && (
          <Images
            open={openAddImages}
            handleClose={() => setOpenAddImages(!openAddImages)}
            callback={getImages}
          />
        )}

        <Accordion open={getExpanded(categoriesKey)} title="Categorias" onChange={() => handleChangeAccordion(categoriesKey)}>
          <Box display="flex">
            <Box width={1}>
              {categories.length === 0 && (<EmptyDataText text="Nenhuma categoria adicionada" />)}

              {categories?.length > 0 && (
                <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                  {categories?.map((cat, indexCat) => (
                    <ChipsCategories category={cat} indexCat={indexCat} />
                  ))}
                </Box>
              )}
            </Box>

            <Box display="flex" alignItems="center">
              <ButtonAdd title="Adicionar categoria" onClick={() => setOpenAddCategories(!openAddCategories)} />
            </Box>
          </Box>
        </Accordion>

        {openAddCategories && (
          <AddCategories
            data={categories}
            setData={setCategories}
            open={openAddCategories}
            handleClose={() => setOpenAddCategories(!openAddCategories)}
          />
        )}

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Accordion open={getExpanded(variationsKey) || getExpanded(tagsKey)} title="Variações" onChange={() => handleChangeAccordion(variationsKey)}>
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

                  <ButtonAdd title="Adicionar variação" onClick={() => setOpenAddVariations(!openAddVariations)} />
                </Box>
              </Accordion>
            </Grid>

            <Grid item xs={12} md={6}>
              <Accordion open={getExpanded(tagsKey) || getExpanded(variationsKey)} title="Tags" onChange={() => handleChangeAccordion(tagsKey)}>
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
          handleClose={() => setOpenAddVariations(!openAddVariations)}
        />
      )}

      <Box display="flex" alignItems="center" justifyContent="end" position="sticky" bottom={8} right={16} pt={4}>
        <Box display="flex" alignItems="center" justifyContent="end" gap={1} bgcolor={colors.background.main}>
          <Button variant="outlined" color="primary">
            Cancelar
          </Button>
          <Button variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default New
