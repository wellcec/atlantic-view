import React, { useState } from 'react'
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  type PercentCrop
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { Box, Button } from '@mui/material'
import Modal from '~/components/molecules/Modal'
import useUtils from '~/shared/hooks/useUtils'
import useProductsService from '~/services/useProductsService'
import useAlerts from '~/shared/alerts/useAlerts'
import { IconUpload } from '~/constants/icons'
import colors from '~/shared/theme/colors'
import { type Mode, type ImageType } from '~/models/products'
import { ACCEPTABLE_IMAGES } from '~/constants'

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): PercentCrop => centerCrop(
  makeAspectCrop(
    {
      unit: '%',
      width: 100
    },
    aspect,
    mediaWidth,
    mediaHeight
  ),
  mediaWidth,
  mediaHeight
)

interface IProps {
  fileName: string
  open: boolean
  mode: Mode
  handleClose: () => void
  onCreateImage: (image: ImageType) => void
}

const Images = ({ fileName, open, mode, handleClose, onCreateImage }: IProps): React.JSX.Element => {
  const [image, setImage] = useState<any>(undefined)
  const [crop, setCrop] = useState<Crop>()
  const [fileImage, setFileImage] = useState<any>()
  const [fileType, setFileType] = useState<string>()

  const { base64ToImage, imageToBase64 } = useUtils()
  const { uploadImage, uploadTempImage } = useProductsService()
  const { notifyError, notifyWarning } = useAlerts()

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const { width, height } = e.currentTarget

    setFileImage(e.currentTarget)
    setCrop(centerAspectCrop(width, height, 1 / 1))
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!ACCEPTABLE_IMAGES.includes(file.type)) {
        notifyWarning('Formato de imagem inválido. Formato deve ser PNG ou JPEG')
        return
      }

      setFileType(file.type.split('/')[1])
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () => { setImage(reader.result?.toString() ?? '') })
      reader.readAsDataURL(file)
    }
  }

  const save = async (): Promise<void> => {
    if (image === '') {
      return
    }

    const base64image = imageToBase64(fileImage, crop)
    if (base64image) {
      const formdataimage = base64ToImage(base64image, `${fileName}.${fileType}`)

      if (mode === 'create') {
        await uploadTempImage([formdataimage]).then(
          (response) => {
            const data = response?.data ?? {}

            if (data?.result) {
              onCreateImage(data?.result)
            }
          },
          (err) => {
            const { message } = err
            notifyError(message)
          }
        )
      }

      if (mode === 'update') {
        await uploadImage([formdataimage]).then(
          (response) => {
            const data = response?.data ?? {}

            if (data?.result) {
              onCreateImage(data?.result)
            }
          },
          (err) => {
            const { message } = err
            notifyError(message)
          }
        )
      }

      handleClose()
      setImage('')
    }
  }

  return (
    <Modal open={open} handleClose={handleClose} title="Adicionar imagem">
      <Box minWidth={500}>
        {!!image && (
          <Box display="flex" justifyContent="center" mb={3}>
            <ReactCrop
              crop={crop}
              onChange={(_, percent) => { setCrop(percent) }}
            >
              <img
                alt="Crop me"
                src={image}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </Box>
        )}

        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          <Button variant="text" component="label">
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} width={150}>
              <Box>
                <IconUpload color={colors.primary.main} />
              </Box>

              <Box>
                Upload imagem
              </Box>
            </Box>

            <input type="file" accept="image/jpeg, image/png" onChange={onSelectFile} hidden />
          </Button>

          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <Box>
              <Button variant="outlined" color="primary" onClick={handleClose}>
                Cancelar
              </Button>
            </Box>

            {!!image && (
              <Box>
                <Button variant="contained" color="primary" onClick={save} onSubmit={(event) => { event.preventDefault() }}>
                  Adicionar imagem
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default Images
