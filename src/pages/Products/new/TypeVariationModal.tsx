import React, { useEffect, useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

import EmptyDataText from '~/components/atoms/EmptyDataText'
import InputHarmonic from '~/components/atoms/Inputs/InputHarmonic'
import Modal from '~/components/molecules/Modal'
import { IconAdd, IconCheckCircule, IconDelete } from '~/constants/icons'
import { type TypeVariationViewType, type TypeVariationType } from '~/models/variations'
import colors from '~/shared/theme/colors'
import { useGetTypeVariations } from '~/clients/variations/getTypeVariations'
import useAlerts from '~/shared/alerts/useAlerts'
import { type Mode } from '~/models/products'
import { useCreateTypeVariation } from '~/clients/variations/createTypeVariation'
import Dialog from '~/components/atoms/Dialog'
import { emptyFilter } from '~/constants'
import { type ISampleFilter } from '~/models'
import { useGetProducts } from '~/clients/products/getProducts'
import { useDeleteTypeVariation } from '~/clients/variations/deleteTypeVariation'
import Divider from '~/components/atoms/Divider'

const useStyles = makeStyles(() => ({
  borderTypeVariation: {
    border: `1px solid ${colors.background.borderLight}`,
    borderRadius: 25
  }
}))

interface IProps {
  mode: Mode
  open: boolean
  handleClose: () => void
  selectedTypeVariations: TypeVariationViewType[]
  saveTypeVariationInProduct: (typeVariations: TypeVariationViewType[]) => void
}

const TypeVariationModal = ({
  mode,
  open,
  handleClose,
  selectedTypeVariations,
  saveTypeVariationInProduct
}: IProps): React.JSX.Element => {
  const styles = useStyles()
  const { notifyError, notifyWarning } = useAlerts()

  const [inputValue, setInputValue] = useState('')
  const [inputHasImage, setInputHasImage] = useState(false)
  const [inputIsUnique, setInputIsUnique] = useState(false)
  const [typeVariations, setTypeVariations] = useState<TypeVariationType[]>([])
  const [typeVariationToDelete, setTypeVariationToDelete] = useState<TypeVariationType>()
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
  const [enableCheckProducts, setEnableCheckProducts] = useState<boolean>(false)
  const [filter, setFilter] = useState<ISampleFilter>(emptyFilter)

  const isSelectedTypeVariation = (item: TypeVariationType): boolean => selectedTypeVariations.some((x) => x.id === item.id)

  const {
    data: resultTypeVariations,
    isSuccess: isSuccessTypeVariations,
    isError: isErrorTypeVariations,
    error: errorTypeVariations
  } = useGetTypeVariations()

  const {
    data: resultProducts,
    isSuccess: isSuccessProducts
  } = useGetProducts(filter, enableCheckProducts)

  const createTypeVariation = useCreateTypeVariation()
  const deleteTypeVariation = useDeleteTypeVariation()

  const handleAddItem = (): void => {
    if (inputValue !== '') {
      const newItem: TypeVariationType = {
        name: inputValue,
        hasImages: inputIsUnique || inputHasImage,
        isUnique: inputIsUnique
      }

      createTypeVariation.mutate(newItem, {
        onSuccess: () => {
          const newarr = [...typeVariations, newItem]
          setTypeVariations(newarr)
          setInputValue('')
          setInputHasImage(false)
        }
      })
    }
  }

  const handleSelectTypeVariation = (itemToAdd: TypeVariationType): void => {
    if (isSelectedTypeVariation(itemToAdd)) {
      return
    }

    if (itemToAdd.isUnique) {
      const hasUnique = selectedTypeVariations.find((x) => x.isUnique)
      if (hasUnique) {
        notifyWarning('Já existe variação única vinculada ao produto.')
        return
      }
    }

    const newarr = [...selectedTypeVariations, itemToAdd]
    saveTypeVariationInProduct(newarr)
    handleClose()
  }

  const handleOpenDeleteTypeVariation = (item: TypeVariationType): void => {
    setTypeVariationToDelete(item)
    setOpenConfirmDelete(true)
  }

  const handleDeleteTypeVariation = (): void => {
    const newFilter: ISampleFilter = {
      ...filter,
      typeVariationId: typeVariationToDelete?.id ?? ''
    }

    setFilter(newFilter)
    setEnableCheckProducts(true)
  }

  const handleCloseDelete = (): void => {
    setOpenConfirmDelete(false)
    setEnableCheckProducts(false)
    setTypeVariationToDelete(undefined)
  }

  useEffect(() => {
    if (enableCheckProducts) {
      if (isSuccessProducts && resultProducts) {
        if (resultProducts.count > 0) {
          notifyWarning('Existem produtos com esse tipo de variação')
        } else {
          deleteTypeVariation.mutate(typeVariationToDelete?.id ?? '')
          setEnableCheckProducts(false)
        }

        handleCloseDelete()
      }
    }
  }, [enableCheckProducts, isSuccessProducts, resultProducts])

  // On loading type variations
  useEffect(() => {
    if (isSuccessTypeVariations && resultTypeVariations) {
      setTypeVariations(resultTypeVariations.data)
    }

    if (isErrorTypeVariations && errorTypeVariations) {
      setTypeVariations([])
      notifyError(`${errorTypeVariations.name} - ${errorTypeVariations.message}`)
    }
  }, [mode, isSuccessTypeVariations, isErrorTypeVariations, errorTypeVariations, resultTypeVariations])

  return (
    <Modal title="Adicione tipos de variações" open={open} handleClose={handleClose}>
      <>
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
            <Box flex="1" minWidth={500}>
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
                    <Checkbox checked={inputIsUnique} onChange={(_, checked) => { setInputIsUnique(checked) }} />
                  }
                  label="Único?"
                />
              </Box>
            </FormGroup>

            <FormGroup>
              <Box minWidth="max-content">
                <FormControlLabel
                  control={
                    <Checkbox checked={inputHasImage} disabled={inputIsUnique} onChange={(_, checked) => { setInputHasImage(checked) }} />
                  }
                  label="Contém imagens?"
                />
              </Box>
            </FormGroup>

            <Button variant="contained" onClick={handleAddItem}>
              Salvar
            </Button>
          </Box>

          <Box mb={2}>
            <Divider title="Tipos de variações existentes" />
          </Box>

          {typeVariations?.length === 0 && (
            <EmptyDataText text="Nenhum tipo de variação criada" />
          )}

          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
            {typeVariations.map((item, index) => (
              <>
                <Box className={styles.borderTypeVariation} key={`chip-${index}`} py={0.5} pl={2} pr={1}>
                  <Box display="flex" alignItems="center" gap={1} height={1}>
                    <Typography variant="body1">
                      <b>{item?.name}</b>
                      {item.hasImages ? ' (Com imagens)' : ''}
                    </Typography>

                    {isSelectedTypeVariation(item) && (
                      <Box display="flex" alignItems="center" p={0.2} title="Tipo de variação já vinculada ao produto">
                        <IconCheckCircule color={colors.info.main} />
                      </Box>
                    )}

                    {!isSelectedTypeVariation(item) && (
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          title="Excluir tipo de variação globalmente"
                          onClick={() => { handleSelectTypeVariation(item) }}
                        >
                          <IconAdd color={colors.success.main} />
                        </IconButton>

                        <IconButton
                          size="small"
                          title="Excluir tipo de variação globalmente"
                          onClick={() => { handleOpenDeleteTypeVariation(item) }}
                        >
                          <IconDelete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            ))}
          </Box>
        </Box>

        {openConfirmDelete && (
          <Dialog
            title="Excluir tipo de variação"
            open={openConfirmDelete}
            handleCloseConfirm={handleCloseDelete}
            handleDelete={() => { handleDeleteTypeVariation() }}
          >
            <Typography variant="body1" color="primary">
              Deseja realmente excluir o tipo de variação
              {' '}
              <b>&quot;{typeVariationToDelete?.name}&quot;</b>
              ?
            </Typography>
          </Dialog>
        )}
      </>
    </Modal>
  )
}

export default TypeVariationModal
