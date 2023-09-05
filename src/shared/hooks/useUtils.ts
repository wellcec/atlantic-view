const useUtils = () => {
  const formatFormCurrency = (valorNumerico: number) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return formatter.format(valorNumerico / 100)
  }

  const formatNumber = (value: string | number, type: 'int' | 'float') => {
    const numericValue = value.toString().replace(/\D/g, '')
    const current = numericValue === '' ? '0' : numericValue

    if (type === 'int') {
      return parseInt(current, 10)
    }

    return parseFloat(current)
  }

  const formatCurrentRequest = (value: string) => {
    const cleared = value.replace('R$ ', '')
    return formatNumber(cleared, 'float') / 100
  }

  const imageToBase64 = (image, crop) => {
    const canvas = document.createElement('canvas')

    const scalex = image.naturalWidth * 0.01
    const scaley = image.naturalHeight * 0.01

    canvas.width = crop.width * scalex
    canvas.height = crop.height * scaley

    const imgCx = canvas.getContext('2d')
    imgCx.drawImage(
      image,
      crop.x * scalex,
      crop.y * scaley,
      crop.width * scalex,
      crop.height * scaley,
      0,
      0,
      crop.width * scalex,
      crop.height * scaley,
    )

    // As Base64 string
    return canvas.toDataURL('image/png')
  }

  const base64ToImage = (dataurl, filename) => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const normalize = (str: string): string => {
    let normalized = str.replace(/[^a-z0-9A-Z\s]/g, '')
    const split = normalized.split(' ').filter((str) => str !== '')
    const join = split.join('-')
    return join.toLowerCase()
  }

  return {
    formatFormCurrency, formatNumber, imageToBase64, base64ToImage, normalize, formatCurrentRequest,
  }
}

export default useUtils
