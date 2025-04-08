import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Checkbox, Chip, FormControlLabel, FormGroup, IconButton, Typography, Divider as DividerMui, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import ButtonAdd from '~/components/atoms/ButtonAdd'
import Divider from '~/components/atoms/Divider'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import { IconAdd, IconCheckCircule, IconDelete } from '~/constants/icons'
import { type TypeVariationViewType, type TypeVariationType, type VariationType } from '~/models/variations'
import useVariationsService from '~/services/useVariationsService'
import useAlerts from '~/shared/alerts/useAlerts'
import InputHarmonic from '~/components/atoms/Inputs/InputHarmonic'
import colors from '~/shared/theme/colors'
import AddVariationsModal from '../modals/AddVariationsModal'
import Images from './Images'
import { MODES } from '~/models/products'
import useUtils from '~/shared/hooks/useUtils'
import ButtonRemove from '~/components/atoms/ButtonRemove'
import { useProductsContext } from '../context'
import { FOLDER_IMAGES, FOLDER_TEMP } from '~/constants'
import { env } from '~/config/env'

const useStyles = makeStyles(() => ({
  borderImages: {
    border: `1px solid ${colors.background.borderLight}`,
    borderRadius: 10
  },
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

const FormVariations = (): React.JSX.Element => {
  const styles = useStyles()

  const { mode, product, setProduct } = useProductsContext()
  const { getTypeVariations, createTypeVariation } = useVariationsService()
  const { notifyError, notifyWarning } = useAlerts()
  const { normalize } = useUtils()

  const [inputValue, setInputValue] = useState('')
  const [inputValueVariation, setInputValueVariation] = useState('')
  const [inputCheckedValue, setInputCheckedValue] = useState(false)
  const [fileName, setFileName] = useState('')

  const [indexVariation, setIndexVariation] = useState<number>(0)
  const [indexTypeVariation, setIndexTypeVariation] = useState<number>(0)
  const [openAddImages, setOpenAddImages] = useState<boolean>(false)
  const [openAddVariations, setOpenAddVariations] = useState<boolean>(false)
  // const [variations, setVariations] = useState<VariationType[]>([])
  const [typeVariations, setTypeVariations] = useState<TypeVariationType[]>([])
  const [selectedTypeVariations, setSelectedTypeVariations] = useState<TypeVariationViewType[]>([])
  const [typeVariationToAddVariation, setTypeVariationToAddVariation] = useState<TypeVariationViewType>()

  const isSelectedTypeVariation = (item: TypeVariationType): boolean => selectedTypeVariations.some((x) => x.id === item.id)
  // const isSelectedVariation = (item: VariationType): boolean => variations.some((x) => x.id === item.id)

  const getUrlImagem = (fileName: string): string => {
    const folder = mode === MODES.create ? FOLDER_TEMP : FOLDER_IMAGES
    return `${env.api.FILES_BASE_URL}${folder}/${fileName}.png`
  }

  const saveTypeVariationInProduct = (typeVariations: TypeVariationViewType[]): void => {
    setSelectedTypeVariations(typeVariations)
    setProduct({ ...product, variations: typeVariations })
  }

  const handleAddVariation = (typeVariation: TypeVariationType): void => {
    if (inputValueVariation === '') {
      notifyWarning('Informe a variação!')
      return
    }

    const current = selectedTypeVariations.find((x) => x.id === typeVariation.id)

    if (!current) {
      return
    }

    const index = selectedTypeVariations.findIndex((x) => x.id === current?.id)

    const newVariation: VariationType = {
      name: inputValueVariation,
      idType: typeVariation.id,
      nameType: typeVariation.name
    }

    if (current?.variations !== undefined) {
      const nameExists = !!current.variations.find((x) => x.name === inputValueVariation)

      if (nameExists) {
        return
      }

      current.variations = [...current.variations, newVariation]
    } else {
      current.variations = [newVariation]
    }

    selectedTypeVariations[index] = current
    saveTypeVariationInProduct([...selectedTypeVariations])
    setOpenAddVariations(!openAddVariations)
    setInputValueVariation('')
  }

  const handleSelectTypeVariation = (itemToAdd: TypeVariationType): void => {
    if (isSelectedTypeVariation(itemToAdd)) {
      return
    }

    const newarr = [...selectedTypeVariations, itemToAdd]
    saveTypeVariationInProduct(newarr)
  }

  const handleDeleteToData = (itemToRemove: TypeVariationViewType): void => {
    const newarr = selectedTypeVariations.filter((item) => item.id !== itemToRemove.id)
    saveTypeVariationInProduct([...newarr])
  }

  const handleModalCreateVariation = (typeToAddVariation: TypeVariationType): void => {
    setOpenAddVariations(!openAddVariations)
    setTypeVariationToAddVariation(typeToAddVariation)
  }

  const handleCloseModalCreateVariation = (): void => {
    setInputValueVariation('')
    setTypeVariationToAddVariation(undefined)
    setOpenAddVariations(!openAddVariations)
  }

  const handleModalAddImage = (typeVariation: TypeVariationViewType, variation: VariationType): void => {
    const nameProduct = product?.title ?? ''

    if (nameProduct === '') {
      notifyWarning('Nome do produto é necessário.')
      return
    }

    const mountedfileName = normalize(`${(typeVariation.variations?.length ?? 0)} ${nameProduct} ${typeVariation.name} ${variation.name}`)

    const indexType = selectedTypeVariations.findIndex((x) => x.id === typeVariation.id)
    const indexVariation = (typeVariation.variations ?? []).findIndex((x) => x.id === variation.id)

    setFileName(mountedfileName)
    setOpenAddImages(!openAddImages)
    setIndexTypeVariation(indexType)
    setIndexVariation(indexVariation)
  }

  const onCreateImage = (): void => {
    const typeVariation = selectedTypeVariations[indexTypeVariation]
    const variation = (typeVariation.variations ?? [])[indexVariation]
    variation.images = [...(variation.images ?? []), fileName]

    if (typeVariation.variations) {
      typeVariation.variations[indexVariation] = variation
    }

    selectedTypeVariations[indexTypeVariation] = typeVariation
    saveTypeVariationInProduct([...selectedTypeVariations])
  }

  const handleAddItem = (): void => {
    if (inputValue !== '') {
      const newItem: TypeVariationType = {
        name: inputValue,
        hasImages: inputCheckedValue
      }

      createTypeVariation(newItem).then(
        () => {
          const newarr = [...typeVariations, newItem]
          setTypeVariations(newarr)
          setInputValue('')
          setInputCheckedValue(false)
        },
        (err) => {
          const { message } = err
          notifyError(message)
        }
      )
    }
  }

  const _getTypeVariations = useCallback(() => {
    getTypeVariations().then(
      (response) => {
        const { data = [] } = response.data ?? {}
        setTypeVariations(data)
      },
      (err) => {
        const { message } = err
        notifyError(message)
      }
    )
  }, [getTypeVariations, notifyError])

  useEffect(() => {
    if (product) {
      setSelectedTypeVariations(product?.variations ?? [])
    }

    _getTypeVariations()
  }, [])

  return (
    <>
      <Box>
        <Box mb={2}>
          <Divider title="Adicione tipos de variações" />
        </Box>

        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
            <Box flex="1" minWidth={385}>
              <InputHarmonic
                placeholder="Informe o tipo de variação. Ex.: Cor, Tamanho, Único"
                value={inputValue}
                onChange={(event: any) => {
                  const { value } = event.target
                  setInputValue(value)
                }}
              />
            </Box>

            <FormGroup>
              <Box minWidth="max-content">
                <FormControlLabel
                  control={
                    <Checkbox checked={inputCheckedValue} onChange={(_, checked) => { setInputCheckedValue(checked) }} />
                  }
                  label="Contém imagens?"
                />
              </Box>
            </FormGroup>

            <ButtonAdd title="Adicionar tipo de variação" onClick={handleAddItem} />
          </Box>

          {typeVariations?.length === 0 && (
            <EmptyDataText text="Nenhum tipo de variação criada" />
          )}

          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
            {typeVariations.map((item, index) => (
              <Chip
                key={`chip-${index}`}
                label={`${item?.name} ${item.hasImages ? '(Com imagens)' : ''}`}
                variant="outlined"
                onClick={() => { handleSelectTypeVariation(item) }}
                onDelete={() => { }}
                deleteIcon={(
                  <Box display="flex" alignItems="center">
                    {isSelectedTypeVariation(item) && (<IconCheckCircule color={colors.success.main} />)}
                    {!isSelectedTypeVariation(item) && (<IconDelete />)}
                  </Box>
                )}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box>
        {selectedTypeVariations.map((typeVariation, index) => (
          <Box mb={3} key={`selectedtype-${index}`}>
            <Box mb={2}>
              <Divider
                title={`➡️ ${typeVariation.name}`}
                Buttons={(
                  <Box>
                    <IconButton
                      size="small"
                      title={`Adicionar variação para ${typeVariation.name}`}
                      onClick={() => { handleModalCreateVariation(typeVariation) }}
                    >
                      <IconAdd color={colors.success.main} />
                    </IconButton>

                    <IconButton
                      size="small"
                      title="Remover tipo de variação"
                      onClick={() => { handleDeleteToData(typeVariation) }}
                    >
                      <IconDelete />
                    </IconButton>
                  </Box>
                )}
              />
            </Box>

            <Box display={typeVariation.hasImages ? 'block' : 'flex'} gap={1} flexWrap="wrap">
              {(typeVariation.variations !== undefined && typeVariation.variations?.length > 0) &&
                typeVariation.variations.map((variation, index) => (
                  <Box key={`variations-${index}`}>
                    {!typeVariation.hasImages && (
                      <Box width="fit-content" p={2} className={styles.borderImages}>
                        {variation.name}
                      </Box>
                    )}

                    {typeVariation.hasImages && (
                      <Box p={2} mb={1} className={styles.borderImages}>
                        <Box>
                          <Typography variant="subtitle2" color="primary">
                            <b><i>{variation.name}</i></b>
                          </Typography>

                          <DividerMui />
                        </Box>

                        <Box display="flex" mt={2}>
                          <Box flex="1">
                            <ImageList variant="masonry" cols={4} gap={10} className={styles.list}>
                              {(variation.images ?? []).map((img, index) => (
                                <ImageListItem key={`images-product-${index}`}>
                                  <img
                                    key={`temp-image-temp-${index}`}
                                    className={styles.img}
                                    src={getUrlImagem(img)}
                                    srcSet={getUrlImagem(img)}
                                    alt={img}
                                    loading="lazy"
                                  />

                                  <ImageListItemBar
                                    className={styles.imageBar}
                                    actionIcon={
                                      <ButtonRemove title="Remover imagem" onClick={() => { }} />
                                    }
                                  />
                                </ImageListItem>
                              ))}
                            </ImageList>

                            {(variation.images ?? []).length === 0 && (
                              <EmptyDataText text={`Nenhuma imagem adicionada para <b>${typeVariation.name} - ${variation.name}</b>`} />
                            )}
                          </Box>

                          <Box>
                            <Button variant="outlined" onClick={() => { handleModalAddImage(typeVariation, variation) }}>
                              Adicionar imagem
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
            </Box>
          </Box>
        ))}
      </Box>

      {(openAddImages && product?.title !== '') && (
        <Images
          open={openAddImages}
          fileName={fileName}
          mode={mode}
          onCreateImage={onCreateImage}
          handleClose={() => { setOpenAddImages(!openAddImages) }}
        />
      )}

      {openAddVariations && (
        <AddVariationsModal
          open={openAddVariations}
          handleClose={handleCloseModalCreateVariation}
          handleAddVariation={handleAddVariation}
          inputValueVariation={inputValueVariation}
          setInputValueVariation={setInputValueVariation}
          typeVariation={typeVariationToAddVariation}
        />
      )}
    </>
  )
}

export default FormVariations
