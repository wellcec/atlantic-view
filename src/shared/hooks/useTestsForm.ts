import { MAIOR_QUE_ZERO } from 'constants/messages'
import useUtils from './useUtils'

const useTestsForm = () => {
  const { formatNumber } = useUtils()

  const greaterThanZero = {
    test: (v) => (v ?? 0) > 0,
    message: MAIOR_QUE_ZERO,
  }

  const greaterThanZeroCurrency = {
    test: (v) => formatNumber(v ?? 0, 'float') > 0,
    message: MAIOR_QUE_ZERO,
  }

  return { greaterThanZero, greaterThanZeroCurrency }
}

export default useTestsForm
