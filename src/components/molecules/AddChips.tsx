import React, { useState } from 'react'
import { Box, Chip } from '@mui/material'
import ButtonAdd from '~/components/atoms/ButtonAdd'
import InputHarmonic from '~/components/atoms/Inputs/InputHarmonic'
import { IconDelete } from '~/constants/icons'
import { VariationType } from '~/models/variations'

interface IProps {
  text: string
  titleButton: string
  data: any[]
  setData: (variationAdded: VariationType[]) => void
  action?: (item: any) => void
  actionDelete?: (item: any) => void
}

const AddChips = ({
  text, data, setData, titleButton, action = () => { }, actionDelete,
}: IProps) => {
  const [field, setField] = useState<string>('')

  const handleAddItem = () => {
    if (field !== '') {
      const newarr = [...data, {
        name: field,
      }]

      setData(newarr)
      setField('')
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleAddItem()
    }
  }

  const handleDeleteItem = (obj: any) => {
    const newarr = data.filter((item) => item.name !== obj.name)
    setData(newarr)
  }

  return (
    <>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <InputHarmonic
          placeholder={text}
          value={field}
          onChange={(event: any) => {
            const { value } = event.target
            setField(value)
          }}
          onKeyDown={handleKeyDown}
        />

        <ButtonAdd title={titleButton} onClick={handleAddItem} />
      </Box>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {data.map((item, index) => (
          <Chip
            key={`chip-${index}`}
            label={item?.name}
            variant="outlined"
            onClick={() => action(item)}
            onDelete={() => (actionDelete ? actionDelete(item) : handleDeleteItem(item))}
            deleteIcon={<Box display="flex" alignItems="center"><IconDelete /></Box>}
          />
        ))}
      </Box>
    </>
  )
}

AddChips.defaultProps = {
  action: () => { },
  actionDelete: undefined,
}

export default AddChips
