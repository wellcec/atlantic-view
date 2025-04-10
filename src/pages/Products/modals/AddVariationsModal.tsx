import React from 'react'
import { Box, Button, useMediaQuery, type Theme } from '@mui/material'
import InputHarmonic from '~/components/atoms/Inputs/InputHarmonic'
import Modal from '~/components/molecules/Modal'
import { type TypeVariationType } from '~/models/variations'

interface IProps {
  open: boolean
  handleClose: () => void
  typeVariation: TypeVariationType | undefined
  inputValueVariation: string
  setInputValueVariation: React.Dispatch<React.SetStateAction<string>>
  handleAddVariation: (typeVariation: TypeVariationType) => void
}

const AddVariationsModal = ({ open, handleClose, typeVariation, inputValueVariation, setInputValueVariation, handleAddVariation }: IProps): React.JSX.Element => {
  const downXS = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'))
  const downSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))
  const downXL = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'))

  const getWidth = (): number => {
    if (downXS) return 200
    if (downSM) return 300
    if (downMD) return 400
    if (downLG) return 500
    if (downXL) return 600
    return 700
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      if (typeVariation) {
        handleAddVariation(typeVariation)
      }
    }
  }

  return (
    <>
      {typeVariation !== undefined && (
        <Modal open={open} handleClose={handleClose} title={`Adicionar variação para ${typeVariation.name}`}>
          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap" textAlign="end">
            <Box flex="2" minWidth={getWidth()}>
              <InputHarmonic
                placeholder={`Adicione uma variação para ${typeVariation.name} Ex.: GG, Verde, 49`}
                value={inputValueVariation}
                onChange={(event: any) => {
                  const { value } = event.target
                  setInputValueVariation(value)
                }}
                onKeyDown={handleKeyDown}
              />
            </Box>

            <Box flex="1">
              <Button variant="contained" onClick={() => { handleAddVariation(typeVariation) }}>
                Criar variação
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  )
}

export default AddVariationsModal
