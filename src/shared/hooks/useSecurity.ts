import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useSecurityAction } from '~/shared/store/ducks/security'

interface ISecurity {
  getUser: () => any
  getCredential: () => string | null
  signout: () => void
}

const useSecurity = (): ISecurity => {
  const navigate = useNavigate()

  const { cleanUser, cleanCredential } = useSecurityAction()

  const { user, credential } = useSelector(({ security }: any) => ({
    user: security.user,
    credential: security.credential as string
  }))

  const getUser = useCallback(() => user || null, [user])

  const getCredential = useCallback(() => credential || null, [credential])

  const signout = useCallback(() => {
    cleanUser()
    cleanCredential()
    navigate('/sign-in', { replace: true })
  }, [cleanUser, cleanCredential, navigate])

  return {
    getUser,
    getCredential,
    signout
  }
}

export default useSecurity
