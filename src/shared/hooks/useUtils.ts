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

  return { formatFormCurrency, formatNumber }
}

export default useUtils
