import React, { useState } from 'react'
import {
  Box, Button, Chip, Grid, Typography,
} from '@mui/material'
import Container from 'components/layout/ContainerMain'
import Accordion from 'components/molecules/Accordion'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { PREENCHIMENTO_OBRIGATORIO } from 'constants/messages'
import { NEW_PRODUCT_KEYS } from 'constants/index'
import { IconSingleArrowDownCircule, IconSingleArrowUpCircule } from 'constants/icons'
import colors from 'shared/theme/colors'
import { TagType } from 'models/products'
import AddChips from 'components/molecules/AddChips'
import ButtonAdd from 'components/atoms/ButtonAdd'
import EmptyDataText from 'components/atoms/EmptyDataText'
import { CategoryType } from 'models/categories'
import useTestsForm from 'shared/hooks/useTestsForm'
import { VariationType } from 'models/variations'
import AddVariations from 'components/organisms/AddVariations'
import AddCategories from '../../../components/organisms/AddCategories'
import ChipsCategories from './ChipsCategories'
import FormProduct from './FormProduct'
import Images from './Images'

const {
  firstInfo: firstInfoKey,
  images: imagesKey,
  categories: categoriesKey,
  tags: tagsKey,
  variations: variationsKey,
} = NEW_PRODUCT_KEYS

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
  const [allExpanded, setAllExpanded] = useState(false)
  const [tags, setTags] = useState<TagType[]>([])
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [openAddCategories, setOpenAddCategories] = useState<boolean>(false)
  const [variations, setVariations] = useState<VariationType[]>([])
  const [openAddVariations, setOpenAddVariations] = useState<boolean>(false)
  // const [categoriesOptions, setCategoriesOptions] = useState<CategoryType[]>([])

  const [openAddImages, setOpenAddImages] = useState<boolean>(false)

  const { greaterThanZero, greaterThanZeroCurrency } = useTestsForm()

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
            <Box width={1}>
              Imagens
            </Box>

            <Box display="flex" alignItems="center">
              <ButtonAdd title="Adicionar imagem" onClick={() => setOpenAddImages(!openAddImages)} />
            </Box>
          </Box>
        </Accordion>

        {openAddImages && (
          <Images
            open={openAddImages}
            handleClose={() => setOpenAddImages(!openAddImages)}
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
