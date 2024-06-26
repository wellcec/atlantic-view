import React, { useCallback, useEffect, useState } from 'react'
import {
  Box, Chip
} from '@mui/material'
import { last as getLast } from 'lodash'
import Divider from '~/components/atoms/Divider'
import Modal from '~/components/molecules/Modal'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import AddChips from '~/components/molecules/AddChips'
import { type ISampleFilter } from '~/models'
import { type GetAllVariationsType, type VariationType } from '~/models/variations'
import useVariationsService from '~/services/useVariationsService'
import useAlerts from '~/shared/alerts/useAlerts'
import { IconDelete } from '~/constants/icons'

const MAX_REGISTERS = 10000
const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: MAX_REGISTERS
}

interface IProps {
  open: boolean
  handleClose: () => void
  data: VariationType[]
  setData: React.Dispatch<React.SetStateAction<any[]>>
}

const AddVariations = ({
  open, handleClose, data, setData
}: IProps): React.JSX.Element => {
  const [variations, setVariations] = useState<VariationType[]>([])

  const { getVariations, createVariation, deleteVariation } = useVariationsService()
  const { notifyError } = useAlerts()

  const getAllVariations = useCallback(() => {
    getVariations(emptyFilter).then(
      (response: GetAllVariationsType) => {
        const { data: dataRes = [] } = response.data ?? {}
        setVariations(dataRes)
      },
      (err) => {
        const { message } = err
        notifyError(message)
      }
    )
  }, [getVariations, notifyError])

  const handleAddVariation = (variationAdded: VariationType[]): void => {
    const last: VariationType | undefined = getLast(variationAdded)

    if (last) {
      createVariation(last).then(
        () => {
          setVariations(variationAdded)
        },
        (err) => {
          const { message } = err
          notifyError(message)
        }
      )
    }
  }

  const handleRemoveVariation = (variationRemoved: VariationType): void => {
    deleteVariation(variationRemoved?.id ?? '').then(
      () => {
        const newarr = variations.filter((item) => item.name !== variationRemoved.name)
        setVariations(newarr)
      },
      (err) => {
        const { message } = err
        notifyError(message)
      }
    )
  }

  const handleAddToData = (variationAddForm: VariationType): void => {
    const newarr = [...data, variationAddForm]
    setData(newarr)
  }

  const handleDeleteToData = (variationRemoveForm: VariationType): void => {
    const newarr = data.filter((item) => item.name !== variationRemoveForm.name)
    setData(newarr)
  }

  useEffect(() => {
    getAllVariations()
  }, [])

  return (
    <Modal open={open} handleClose={handleClose} title="Adicionar variações">
      <Box minWidth={500}>
        <Box>
          <Box mb={2}>
            <Divider title="Crie variações" />
          </Box>

          <Box mb={2}>
            <AddChips
              data={variations}
              setData={handleAddVariation}
              action={handleAddToData}
              actionDelete={handleRemoveVariation}
              text="Informe o nome da variação. Ex.: GG"
              titleButton="Adicionar variação"
            />
          </Box>

          <Box mb={2}>
            <Divider title="Variações selecionadas para o produto" />
          </Box>

          <Box mb={2}>
            {data?.length === 0 && (
              <EmptyDataText text="Nenhuma variação selecionada" />
            )}

            {data?.length > 0 && (
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
                {data?.map((variation, indexVariation) => (
                  <Chip
                    key={`chip-${indexVariation}`}
                    label={variation?.name}
                    variant="outlined"
                    onDelete={() => { handleDeleteToData(variation) }}
                    deleteIcon={<Box display="flex" alignItems="center"><IconDelete /></Box>}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddVariations
