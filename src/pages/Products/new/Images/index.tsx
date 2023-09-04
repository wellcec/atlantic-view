/* eslint-disable sonarjs/no-identical-expressions */
import React, { useState } from 'react'
import ReactCrop, {
  Crop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { Box, Button } from '@mui/material'
import Modal from 'components/molecules/Modal'
import useUtils from 'shared/hooks/useUtils'
import useProductsService from 'services/useProductsService'
import { useAlerts } from 'shared/alerts/AlertContext'
import { IconUpload } from 'constants/icons'
import colors from 'shared/theme/colors'

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) => centerCrop(
  makeAspectCrop(
    {
      unit: '%',
      width: 100,
    },
    aspect,
    mediaWidth,
    mediaHeight,
  ),
  mediaWidth,
  mediaHeight,
)

interface IProps {
  lengthImages: number
  titleProduct: string
  open: boolean,
  handleClose: () => void
  callback: () => void
}

const Images = ({
  lengthImages, titleProduct, open, handleClose, callback,
}: IProps) => {
  const [image, setImage] = useState<any>(undefined)
  const [crop, setCrop] = useState<Crop>()
  const [fileImage, setFileImage] = useState<any>()

  const { base64ToImage, imageToBase64, normalize } = useUtils()
  const { uploadImage } = useProductsService()
  const { setAlert } = useAlerts()

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget

    setFileImage(e.currentTarget)
    setCrop(centerAspectCrop(width, height, 1 / 1))
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () => setImage(reader.result?.toString() || ''))
      reader.readAsDataURL(file)
    }
  }

  const save = async () => {
    if (image === '') {
      return
    }

    const base64image = imageToBase64(fileImage, crop)
    if (base64image) {
      const nameImage = normalize(titleProduct)
      const formdataimage = base64ToImage(base64image, `${lengthImages}-${nameImage}.png`)

      await uploadImage([formdataimage]).then(
        () => {
          callback()
        },
        (err) => {
          const { message } = err
          setAlert({ type: 'error', message })
        },
      )
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
              onChange={(_, percent) => setCrop(percent)}
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
                <Button variant="contained" color="primary" onClick={save} onSubmit={(event) => event.preventDefault()}>
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
