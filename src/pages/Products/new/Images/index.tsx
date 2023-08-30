/* eslint-disable sonarjs/no-identical-expressions */
import React, { useState } from 'react'
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import { v4 as uuidv4 } from 'uuid'
import 'react-image-crop/dist/ReactCrop.css'

import { Box, Button } from '@mui/material'
import Modal from 'components/molecules/Modal'
import useUtils from 'shared/hooks/useUtils'
import useProductsService from 'services/useProductsService'
import { useAlerts } from 'shared/alerts/AlertContext'

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
  open: boolean,
  handleClose: () => void
}

const Images = ({ open, handleClose }: IProps) => {
  const [image, setImage] = useState<any>(undefined)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [fileImage, setFileImage] = useState<any>()

  const { base64ToImage, imageToBase64 } = useUtils()
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
      const formdataimage = base64ToImage(base64image, `${uuidv4()}.png`)

      await uploadImage([formdataimage]).then(
        () => {
          console.info('Image uplaoded successfully')
        },
        () => {
          setAlert({ type: 'error', message: 'Algo deu errado ao fazer upload.' })
        },
      )
      handleClose()
      setImage('')
    }
  }

  return (
    <Modal open={open} handleClose={handleClose} title="Adicionar imagem">
      <Box minWidth={500}>
        <input type="file" accept="image/jpeg, image/png" onChange={onSelectFile} />

        {!!image && (
          <>
            <ReactCrop
              crop={crop}
              onChange={(cropChange) => setCrop(cropChange)}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                alt="Crop me"
                src={image}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </>
        )}

        <Button variant="contained" color="primary" onClick={save}>
          Adicionar imagem
        </Button>
      </Box>
    </Modal>
  )
}

export default Images
