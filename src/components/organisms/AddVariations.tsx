import React, { useCallback, useEffect, useState } from 'react'
import {
  Box, Chip,
} from '@mui/material'
import { last as getLast } from 'lodash'
import Divider from '~/components/atoms/Divider'
import Modal from '~/components/molecules/Modal'
import EmptyDataText from '~/components/atoms/EmptyDataText'
import AddChips from '~/components/molecules/AddChips'
import { ISampleFilter } from '~/models'
import { GetAllVariationsType, VariationType } from '~/models/variations'
import useVariationsService from '~/services/useVariationsService'
import { useAlerts } from '~/shared/alerts/AlertContext'
import { IconDelete } from '~/constants/icons'

const MAX_REGISTERS = 10000
const emptyFilter: ISampleFilter = {
  term: '',
  page: 1,
  pageSize: MAX_REGISTERS,
}

interface IProps {
  open: boolean,
  handleClose: () => void
  data: VariationType[]
  setData: React.Dispatch<React.SetStateAction<any[]>>
}

const AddVariations = ({
  open, handleClose, data, setData,
}: IProps) => {
  // const [selected, setSelected] = useState<CategoryType>()
  const [variations, setVariations] = useState<VariationType[]>([])

  const { getVariations, createVariation, deleteVariation } = useVariationsService()
  const { setAlert } = useAlerts()

  const getAllVariations = useCallback(() => {
    getVariations(emptyFilter).then(
      (response: GetAllVariationsType) => {
        const { data: dataRes = [] } = response.data ?? {}
        setVariations(dataRes)
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      },
    )
  }, [getVariations, setAlert])

  const handleAddVariation = (variationAdded: VariationType[]) => {
    const last: VariationType | undefined = getLast(variationAdded)

    if (last) {
      createVariation(last).then(
        () => {
          setVariations(variationAdded)
        },
        (err) => {
          const { message } = err
          setAlert({ type: 'error', message })
        },
      )
    }
  }

  const handleRemoveVariation = (variationRemoved: VariationType) => {
    deleteVariation(variationRemoved?.id ?? '').then(
      () => {
        const newarr = variations.filter((item) => item.name !== variationRemoved.name)
        setVariations(newarr)
      },
      (err) => {
        const { message } = err
        setAlert({ type: 'error', message })
      },
    )
  }

  const handleAddToData = (variationAddForm: VariationType) => {
    const newarr = [...data, variationAddForm]
    setData(newarr)
  }

  const handleDeleteToData = (variationRemoveForm: VariationType) => {
    const newarr = data.filter((item) => item.name !== variationRemoveForm.name)
    setData(newarr)
  }

  useEffect(() => {
    getAllVariations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    onDelete={() => handleDeleteToData(variation)}
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
