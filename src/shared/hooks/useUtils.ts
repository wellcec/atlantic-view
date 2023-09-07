interface IUtils {
  formatFormCurrency: (valorNumerico: number) => string
  formatNumber: (value: string | number, type: 'int' | 'float') => number
  imageToBase64: (image: any, crop: any) => string
  base64ToImage: (dataurl: any, filename: any) => File
  normalize: (str: string) => string
  formatCurrencyRequest: (value: string) => number
  formatCurrencyString: (value: number | undefined) => string
}

const useUtils = (): IUtils => {
  const formatFormCurrency = (valorNumerico: number): string => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return formatter.format(valorNumerico / 100)
  }

  const formatNumber = (value: string | number, type: 'int' | 'float'): number => {
    const numericValue = value.toString().replace(/\D/g, '')
    const current = numericValue === '' ? '0' : numericValue

    if (type === 'int') {
      return parseInt(current, 10)
    }

    return parseFloat(current)
  }

  const formatCurrencyRequest = (value: string): number => {
    const cleared = value.replace('R$ ', '')
    return formatNumber(cleared, 'float') / 100
  }

  const formatCurrencyString = (value: number | undefined): string => {
    if (!value) {
      return 'R$ 0,00'
    }
    return formatFormCurrency(formatNumber(value, 'float'))
  }

  const imageToBase64 = (image: any, crop: any): string => {
    const canvas = document.createElement('canvas')

    const scalex = image.naturalWidth * 0.01
    const scaley = image.naturalHeight * 0.01

    canvas.width = crop.width * scalex
    canvas.height = crop.height * scaley

    const imgCx = canvas.getContext('2d')
    imgCx?.drawImage(
      image,
      crop.x * scalex,
      crop.y * scaley,
      crop.width * scalex,
      crop.height * scaley,
      0,
      0,
      crop.width * scalex,
      crop.height * scaley
    )

    // As Base64 string
    return canvas.toDataURL('image/png')
  }

  const base64ToImage = (dataurl: any, filename: any): File => {
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
    const normalized = str.replace(/[^a-z0-9A-Z\s]/g, '')
    const split = normalized.split(' ').filter((str) => str !== '')
    const join = split.join('-')
    return join.toLowerCase()
  }

  return {
    formatFormCurrency, formatNumber, imageToBase64, base64ToImage, normalize, formatCurrencyRequest, formatCurrencyString
  }
}

export default useUtils
