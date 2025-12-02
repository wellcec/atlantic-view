import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, IconButton, Typography, Divider as DividerMui, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import Divider from '~/components/atoms/Divider'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import { IconAdd, IconDelete } from '~/constants/icons'
import { ImageVariationType, TypeVariationViewType, type TypeVariationProductType, type TypeVariationType, type VariationType } from '~/models/variations'
import useAlerts from '~/shared/alerts/useAlerts'
import colors from '~/shared/theme/colors'
import AddVariationsModal from '../modals/AddVariationsModal'
import Images from './Images'
import { type ImageType, MODES } from '~/models/products'
import useUtils from '~/shared/hooks/useUtils'
import ButtonRemove from '~/components/atoms/ButtonRemove'
import { useProductsContext } from '../context'
import { FOLDER_IMAGES, FOLDER_TEMP } from '~/constants'
import { env } from '~/config/env'
import { useDeleteTempImageByName } from '~/clients/products/deleteTempImage'
import TypeVariationModal from './TypeVariationModal'
import ButtonAdd from '~/components/atoms/ButtonAdd'
import { useDeleteDefinitiveImage } from '~/clients/products/deleteDefinitiveImage'
import { groupTypeVariations, ungroupTypeVariations } from '../utils'

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
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [inputValueVariation, setInputValueVariation] = useState('')
  const [fileName, setFileName] = useState('')

  const [indexVariation, setIndexVariation] = useState<number>(0)
  const [indexTypeVariation, setIndexTypeVariation] = useState<number>(0)
  const [openAddImages, setOpenAddImages] = useState<boolean>(false)
  const [openAddVariations, setOpenAddVariations] = useState<boolean>(false)
  const [openAddTypeVariations, setOpenAddTypeVariations] = useState<boolean>(false)
  // const [selectedTypeVariations, setSelectedTypeVariations] = useState<TypeVariationViewType[]>([])
  const [typeVariationToAddVariation, setTypeVariationToAddVariation] = useState<TypeVariationType>()

  const [viewVariations, setViewVariations] = useState<TypeVariationViewType[]>([])

  const { mode, product, setProduct } = useProductsContext()
  const { notifyWarning } = useAlerts()
  const { normalize, generateTimestampCode } = useUtils()

  const deleteTempImageByName = useDeleteTempImageByName()
  const deleteDefinitiveImageByName = useDeleteDefinitiveImage()

  const getUrlImagem = (fileName: string): string => {
    const folder = mode === MODES.create ? FOLDER_TEMP : FOLDER_IMAGES
    return `${env.api.FILES_BASE_URL}${folder}/${fileName}`
  }

  const saveTypeVariationInProduct = (productVariations: VariationType[]): void => {
    setViewVariations(groupTypeVariations(productVariations))
    setProduct({
      ...product,
      variations: productVariations
    })
  }

  const handleAddVariation = (typeVariation: TypeVariationType): void => {
    if (inputValueVariation === '') {
      notifyWarning('Informe a variação!')
      return
    }

    const current = viewVariations.find((x) => x.typeVariation.uuid === typeVariation.uuid)

    if (!current) {
      return
    }

    const index = viewVariations.findIndex((x) => x.typeVariation.uuid === current?.typeVariation.uuid)

    const newVariation: VariationType = {
      title: inputValueVariation,
      uuidTypeVariation: typeVariation.uuid,
      images: [],
      typeVariation
    }

    if (current?.variations !== undefined) {
      const nameExists = !!current.variations.find((x) => x.title === inputValueVariation)

      if (nameExists) {
        return
      }

      current.variations = [...current.variations, newVariation]
    } else {
      current.variations = [newVariation]
    }

    viewVariations[index] = current
    saveTypeVariationInProduct(ungroupTypeVariations([...viewVariations]))
    setOpenAddVariations(false)
    setInputValueVariation('')
  }

  const handleDeleteVariation = (indexTypeVariation: number, indexVariation: number): void => {
    const typeVariation = viewVariations[indexTypeVariation]
    let variations = typeVariation.variations ?? []

    const variation = variations[indexVariation]

    variations = variations.filter((x) => x.title !== variation.title)
    typeVariation.variations = variations
    viewVariations[indexTypeVariation] = typeVariation

    const onSuccess = (): void => {
      saveTypeVariationInProduct(ungroupTypeVariations([...viewVariations]))
    }

    if (variation?.images && variation.images.length > 0) {
      const imagesToDelete: ImageVariationType[] = variation.images.map((x) => x)

      if (mode === MODES.create) {
        deleteTempImageByName.mutate(imagesToDelete.map(x => x.fileName), { onSuccess })
      }

      if (mode === MODES.update) {
        deleteDefinitiveImageByName.mutate(imagesToDelete.map(x => x.fileName), { onSuccess })
      }
    } else {
      onSuccess()
    }
  }

  const handleModalCreateVariation = (typeToAddVariation: TypeVariationType): void => {
    buttonRef.current?.blur()
    setOpenAddVariations(true)
    setTypeVariationToAddVariation(typeToAddVariation)
  }

  const handleCloseModalCreateVariation = (): void => {
    setInputValueVariation('')
    setTypeVariationToAddVariation(undefined)
    setOpenAddVariations(false)
  }

  const handleDeleteToData = (itemToRemove: TypeVariationType): void => {
    const newarr = viewVariations.filter((item) => item.typeVariation.uuid !== itemToRemove.uuid)
    saveTypeVariationInProduct(ungroupTypeVariations([...newarr]))
  }

  const onSelectTypeVariation = (typeToAdd: TypeVariationType): void => {
    const found = viewVariations.find((x) => x.typeVariation?.uuid === typeToAdd?.uuid)
    if (found) {
      notifyWarning(`O tipo de variação <b>${typeToAdd.title}</b> já foi adicionado.`)
      return
    }

    const newTypeVariation: TypeVariationViewType = {
      typeVariation: typeToAdd,
      variations: []
    }

    const newViewVariations = [...viewVariations, newTypeVariation]
    setViewVariations(newViewVariations)
  }

  const handleModalAddImage = (variation: VariationType): void => {
    const nameProduct = product?.title ?? ''

    if (nameProduct === '') {
      notifyWarning('Nome do produto é necessário.')
      return
    }

    const mountedfileName = normalize(`$${nameProduct} ${variation.title} ${(variation?.images?.length ?? 0)} ${generateTimestampCode()}`)

    const indexType = viewVariations.findIndex((x) => x.typeVariation.uuid === variation.uuidTypeVariation)
    const indexVariation = (viewVariations[indexType].variations ?? []).findIndex((x) => x.title === variation.title)

    setFileName(mountedfileName)
    setOpenAddImages(!openAddImages)
    setIndexTypeVariation(indexType)
    setIndexVariation(indexVariation)
  }

  const handleDeleteImage = (indexTypeVariation: number, indexVariation: number, image: string): void => {
    const onSuccess = (): void => {
      const typeVariation = viewVariations[indexTypeVariation]
      const variation = (typeVariation.variations ?? [])[indexVariation]

      variation.images = (variation.images ?? []).filter((x) => x.fileName !== image)
      variation.images = [...variation.images]

      if (typeVariation.variations) {
        typeVariation.variations[indexVariation] = variation
      }

      viewVariations[indexTypeVariation] = typeVariation
      saveTypeVariationInProduct(ungroupTypeVariations([...viewVariations]))
    }

    if (mode === MODES.create) {
      deleteTempImageByName.mutate([image], { onSuccess })
    }

    if (mode === MODES.update) {
      deleteDefinitiveImageByName.mutate([image], { onSuccess })
    }
  }

  const onCreateImage = (image: ImageType): void => {
    const typeVariation = viewVariations[indexTypeVariation]
    const variation = (typeVariation.variations ?? [])[indexVariation]
    variation.images = [...(variation.images ?? []), {
      fileName: image.fileName,
      uuidVariation: variation.uuid,
    }]

    if (typeVariation.variations) {
      typeVariation.variations[indexVariation] = variation
    }

    viewVariations[indexTypeVariation] = typeVariation
    saveTypeVariationInProduct(ungroupTypeVariations([...viewVariations]))
  }

  useEffect(() => {
    if (product?.variations && product.variations.length > 0) {
      const viewVariations = groupTypeVariations(product?.variations ?? [])
      setViewVariations(viewVariations)
    }
  }, [product])

  return (
    <>
      <Box>
        <Box mb={2}>
          <Divider title="Adicione tipos de variações" />
        </Box>

        <Box textAlign="end">
          <ButtonAdd title="Adicionar tipo de variação" onClick={() => { setOpenAddTypeVariations(true) }} />
        </Box>
      </Box>

      <Box>
        {viewVariations.map((viewVariation, indexViewVariation) => (
          <Box mb={3} key={`selectedtype-${indexViewVariation}`}>
            <Box mb={2}>
              <Divider
                title={`➡️ ${viewVariation.typeVariation?.title}`}
                Buttons={(
                  <Box>
                    <IconButton
                      ref={buttonRef}
                      size="small"
                      title={`Adicionar variação para ${viewVariation.typeVariation?.title}`}
                      onClick={() => { handleModalCreateVariation(viewVariation.typeVariation) }}
                    >
                      <IconAdd color={colors.success.main} />
                    </IconButton>

                    <IconButton
                      size="small"
                      title="Remover tipo de variação"
                      onClick={() => { handleDeleteToData(viewVariation.typeVariation) }}
                    >
                      <IconDelete />
                    </IconButton>
                  </Box>
                )}
              />
            </Box>

            <Box display={viewVariation.typeVariation.hasImages ? 'block' : 'flex'} gap={1} flexWrap="wrap">
              {(viewVariation.variations !== undefined && viewVariation.variations?.length > 0) &&
                viewVariation.variations.map((variation, indexCurrentVariation) => (
                  <Box key={`variations-${indexCurrentVariation}`}>
                    {!viewVariation.typeVariation.hasImages && (
                      <Box width="fit-content" p={2} className={styles.borderImages}>
                        {variation.title}
                      </Box>
                    )}

                    {viewVariation.typeVariation.hasImages && (
                      <Box p={2} mb={1} className={styles.borderImages}>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="subtitle2" color="primary">
                              <b>{variation.title}</b>
                            </Typography>

                            <Box display="flex" gap={2}>
                              <Button variant="outlined" onClick={() => { handleModalAddImage(variation) }}>
                                Adicionar imagem
                              </Button>

                              <IconButton
                                size="medium"
                                title="Remover variação"
                                onClick={() => { handleDeleteVariation(indexTypeVariation, indexCurrentVariation) }}
                              >
                                <IconDelete size={25} />
                              </IconButton>
                            </Box>
                          </Box>

                          <DividerMui />
                        </Box>

                        <Box display="flex" alignItems="center" mt={2}>
                          <Box flex="1">
                            {(variation.images ?? []).length > 0 && (
                              <ImageList variant="masonry" cols={4} gap={10} className={styles.list}>
                                {(variation.images ?? []).map((img, indexImage) => (
                                  <ImageListItem key={`images-product-${indexImage}`}>
                                    <img
                                      key={`temp-image-temp-${indexImage}`}
                                      className={styles.img}
                                      src={getUrlImagem(img.fileName)}
                                      srcSet={getUrlImagem(img.fileName)}
                                      alt={img.fileName}
                                      loading="lazy"
                                    />

                                    <ImageListItemBar
                                      className={styles.imageBar}
                                      actionIcon={
                                        <ButtonRemove title="Remover imagem" onClick={() => { handleDeleteImage(indexTypeVariation, indexCurrentVariation, img.fileName) }} />
                                      }
                                    />
                                  </ImageListItem>
                                ))}
                              </ImageList>
                            )}

                            {(variation.images ?? []).length === 0 && (
                              <EmptyDataText text={`Nenhuma imagem adicionada para <b>${viewVariation.typeVariation.title} - ${variation.title}</b>`} />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
            </Box>
          </Box>
        ))}

        {(viewVariations && viewVariations.length === 0) && (
          <EmptyDataText text="Nenhum tipo de variação selecionado" />
        )}
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

      {openAddTypeVariations && (
        <TypeVariationModal
          mode={mode}
          open={openAddTypeVariations}
          handleClose={() => { setOpenAddTypeVariations(false) }}
          onSelectTypeVariation={onSelectTypeVariation}
          viewVariations={viewVariations}
        />
      )}
    </>
  )
}

export default FormVariations
